//using backend.Data;
//using FluentValidation.AspNetCore;
//using System.Reflection;
//using backend.Models;

//var builder = WebApplication.CreateBuilder(args);

//// Add services to the container.

//builder.Services.AddControllers().
//    AddFluentValidation(c => c.RegisterValidatorsFromAssemblyContaining<UsersModel>());
//// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
//builder.Services.AddScoped<UsersRepository>();
//builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();

//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowReactApp", policy =>
//        policy.WithOrigins("http://localhost:5173") // React development server
//              .AllowAnyHeader()
//              .AllowAnyMethod());
//});

//var app = builder.Build();

//app.UseCors("AllowReactApp");

//// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

//app.UseHttpsRedirection();

//app.UseAuthorization();

//app.MapControllers();

//app.Run();








//using backend.Data;
//using FluentValidation.AspNetCore;
//using System.Reflection;
//using backend.Models;

//var builder = WebApplication.CreateBuilder(args);

//// Add services to the container.
//builder.Services.AddControllers()
//    .AddFluentValidation(c => c.RegisterValidatorsFromAssemblyContaining<UsersModel>());

//// Register repositories and other dependencies
//builder.Services.AddScoped<UsersRepository>();

//// Add Swagger for API documentation
//builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();

//// Configure CORS to allow React frontend
//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowReactApp", policy =>
//        policy.WithOrigins("http://localhost:5173") // React development server
//              .AllowAnyHeader()
//              .AllowAnyMethod());
//});

//var app = builder.Build();

//// Apply CORS policy
//app.UseCors("AllowReactApp");

//// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

//// Use HTTPS redirection only in non-development environments
//if (!app.Environment.IsDevelopment())
//{
//    app.UseHttpsRedirection();
//}

//// Authorization middleware (ready for future authentication implementation)
//app.UseAuthorization();

//// Map controllers to API endpoints
//app.MapControllers();

//app.Run();








using backend.Data;
using FluentValidation.AspNetCore;
using System.Reflection;
using backend.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddFluentValidation(c => c.RegisterValidatorsFromAssemblyContaining<AuthModel>());

// Register repositories and other dependencies
builder.Services.AddScoped<AuthRepository>();

// Add Swagger for API documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
            ValidAudience = builder.Configuration["JwtSettings:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:SecretKey"]))
        };
    });

// Configure CORS to allow React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
        policy.WithOrigins("http://localhost:5173") // React development server
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();

// Apply CORS policy
app.UseCors("AllowReactApp");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Use HTTPS redirection only in non-development environments
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

// Enable Authentication and Authorization
app.UseAuthentication();  // Add this line to use JWT Authentication
app.UseAuthorization();   // This line already exists

// Map controllers to API endpoints
app.MapControllers();

app.Run();
