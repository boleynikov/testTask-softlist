import { SPFI, spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/sputilities";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/fields";
import "@pnp/sp/site-users";
import "@pnp/sp/site-groups/web";
import "@pnp/sp/security/list";
import IDataProvider, { Category, ItemRequest, RequestStatus, UserRole } from "./IDataProvider";
import { FormCustomizerContext } from "@microsoft/sp-listview-extensibility";
import { IPersonaProps } from "office-ui-fabric-react";
import { ISiteUserProps, IWebEnsureUserResult } from "@pnp/sp/site-users";

export default class SharePointDataProvider implements IDataProvider {
    private sp: SPFI;
    public constructor(context: FormCustomizerContext) {
        this.sp = spfi().using(SPFx(context));
    }
    async checkUserRolesForRequestById(requestId: number): Promise<UserRole[]> {
        const roles: UserRole[] = [];
        const currentUserId = (await this.sp.web.currentUser()).Id
        const requestFields = await this.sp.web.lists
            .getByTitle("Purchase Requests").items
            .getById(requestId)
            .select("Author/Title", "Author/ID", "ResponsiblesId")
            .expand("Author")();

        console.log(requestFields);
        if (currentUserId == requestFields.Author.ID) {
            roles.push(UserRole.Manager);
        }
        const adminGroupExist = (await this.sp.web.currentUser.groups())?.some(group => group.LoginName == "Admins")
        if (adminGroupExist) {
            roles.push(UserRole.Admin);
        }
        if (requestFields.ResponsiblesId.includes(currentUserId)) {
            roles.push(UserRole.Responsible);
        }
        console.log("roles", roles);
        return roles;
    }
    async addNewRequest(newRequest: ItemRequest): Promise<void> {
        console.log("income requst", newRequest);
        let responsibleUsersIds: number[] = await this.getUsersIdsByEmails(newRequest.responsibles);
        let _newRequest = await this.sp.web.lists.getByTitle("Purchase Requests").items.add({
            Title: newRequest.title,
            CategoryId: newRequest.category.value,
            Manufacturer: newRequest.Manufacturer.text,
            Price: newRequest.price.toString(),
            ResponsiblesId: responsibleUsersIds,
            Requeststatus: newRequest.requestStatus.text
        });
        console.log("_newRequest", _newRequest);
    }
    async updateRequestById(requestId: number, request: ItemRequest): Promise<void> {
        console.log(`updating request Id=${requestId}`, request);
        let responsibleUsersIds: number[] = await this.getUsersIdsByEmails(request.responsibles);
        const i = await this.sp.web.lists.getByTitle("Purchase Requests")
            .items
            .getById(requestId)
            .update({
                Title: request.title,
                CategoryId: request.category.value,
                Manufacturer: request.Manufacturer.text,
                Price: request.price.toString(),
                ResponsiblesId: responsibleUsersIds,
                Requeststatus: request.requestStatus.text
            });
        console.log("updated", i);
    }
    async getRequestById(requestId: number): Promise<ItemRequest> {
        const item = await this.sp.web.lists
            .getByTitle("Purchase Requests")
            .items.getById(requestId)
            .select("Title", "CategoryId", "Manufacturer", "Price", "Requeststatus", "ResponsiblesId")();
        const persons: IPersonaProps[] = item.ResponsiblesId?.map(async (Id: number) => {
            const user = await this.getUserById(Id);
            console.log("user", user);
            const props: IPersonaProps = {
                secondaryText: user.Email
            }
            return props;

        })
        const userProps = item.ResponsiblesId != undefined ? await Promise.all(persons) : null;
        const itemRequest: ItemRequest = {
            category: {
                label: "",
                value: item.CategoryId
            },
            Manufacturer: {
                key: item.Manufacturer,
                text: item.Manufacturer
            },
            title: item.Title,
            responsibles: userProps,
            price: item.Price,
            requestStatus:
            {
                key: item.Requeststatus,
                text: item.Requeststatus
            }
        }

        console.log("item -- ", item);

        return itemRequest;
    }
    async getUserById(userId: number): Promise<ISiteUserProps> {
        const user: ISiteUserProps = await this.sp.web.siteUsers.getById(userId)();
        return user;
    }
    async getCategories(): Promise<Category[]> {
        const items = await this.sp.web.lists
            .getByTitle("Categories")
            .select("Title", "ID")
            .items();
        const categories: Category[] = items.map((category: any) => {
            return {
                label: category.Title,
                value: category.ID
            }
        });
        return categories;
    }
    async getValuesFromField(fieldName: string): Promise<RequestStatus[]> {
        const items = await this.sp.web.lists
            .getByTitle("Purchase Requests")
            .fields.filter(`EntityPropertyName eq '${fieldName}'`)
            .select("Choices")();
        const statuses: RequestStatus[] = items[0]?.Choices.map(status => {
            return {
                key: status,
                text: status
            }
        });
        return statuses;
    }
    private async getUsersIdsByEmails(userProps: IPersonaProps[]): Promise<number[]> {
        let ids = userProps.map(async (prop: IPersonaProps) => {
            try {
                const userEnsure: IWebEnsureUserResult = await this.sp.web.ensureUser(prop.secondaryText);
                const user: ISiteUserProps = await this.sp.web.siteUsers.getByEmail(prop.secondaryText)();
                console.log("user", userEnsure);
                return (user.Id);
            } catch (err) {
                console.log(err);
            }
        });
        let result = await Promise.all(ids);
        console.log("result", result);
        return result;
    }
}