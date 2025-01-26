using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Linq;

public class SwaggerFileUploadOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        var formFileParams = context.ApiDescription.ParameterDescriptions
            .Where(x => x.ModelMetadata.ModelType == typeof(IFormFile));

        foreach (var param in formFileParams)
        {
            var fileParam = operation.RequestBody.Content["multipart/form-data"];
            fileParam.Schema.Properties[param.Name] = new OpenApiSchema
            {
                Type = "string",
                Format = "binary"
            };
        }
    }
}
