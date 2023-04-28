using Microsoft.SharePoint.Client;
using PnP.Framework;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace UpdateSharepointContentType
{
    internal class Program
    {
        static async Task Main(string[] args)
        {
            await UpdateContentType();
        }

        static async Task UpdateContentType()
        {
            Console.WriteLine("Start");
            string ClientSecret = "V0LHNOGfswTVd+cWmGjwMmDF1liUUI73YiUoDnz3Tgc=";
            string ClientId = "6cddbf50-90c0-476e-8468-3a8638ae45f5";
            string siteUrl = "https://softlist365.sharepoint.com/sites/devOleinikov";
            string contentTypeName = "Елемент";
            string componentId = "61469e45-a237-4059-9b37-e6b26e3fcc65";

            using ( var clientContext = new AuthenticationManager().GetACSAppOnlyContext(siteUrl, ClientId, ClientSecret))
            {
                try
                {
                    var lists = clientContext.Web.Lists;
                    clientContext.Load(lists);
                    await clientContext.ExecuteQueryAsync();
                    foreach (var lst in lists)
                    {
                        Console.WriteLine(lst.Title, lst.Id);
                    }
                    var list = clientContext.Web.Lists.GetByTitle("Purchase Requests");
                    clientContext.Load(list, l => l.Title, l => l.ContentTypes.Include(c => c.NewFormClientSideComponentId, c => c.EditFormClientSideComponentId, c => c.DisplayFormClientSideComponentId));
                    await clientContext.ExecuteQueryAsync();

                    if (list != null)
                    {

                        var contentTypeCollection = list.ContentTypes;
                        clientContext.Load(contentTypeCollection);
                        await clientContext.ExecuteQueryAsync();
                        foreach (var contentType in contentTypeCollection)
                        {
                            Console.WriteLine("contentType: ", contentType.Name);
                        }
                        var customerCT = contentTypeCollection.Where(c => c.Name == contentTypeName).FirstOrDefault();
                        if (customerCT != null)
                        {
                            customerCT.NewFormClientSideComponentId = componentId;
                            customerCT.EditFormClientSideComponentId = componentId;
                            customerCT.DisplayFormClientSideComponentId = componentId;

                            customerCT.Update(false);
                            await clientContext.ExecuteQueryAsync();

                            Console.ForegroundColor = ConsoleColor.Green;
                            Console.WriteLine(contentTypeName + " content type form component ID's updated");
                        }
                    }
                }
                catch (Exception ex)
                {
                    throw new Exception(ex.Message, ex);
                }
            }
            
            Console.WriteLine("End");
        }
    }
}
