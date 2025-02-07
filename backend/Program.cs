using backend.Data;
using FluentValidation.AspNetCore;
using System.Reflection;
using backend.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using CloudinaryDotNet;
using backend.Services;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddFluentValidation(c => c.RegisterValidatorsFromAssemblyContaining<UsersModel>());
builder.Services.AddControllers()
    .AddFluentValidation(c => c.RegisterValidatorsFromAssemblyContaining<LeagueModel>());
builder.Services.AddControllers()
    .AddFluentValidation(c => c.RegisterValidatorsFromAssemblyContaining<TeamModel>());
builder.Services.AddControllers()
    .AddFluentValidation(c => c.RegisterValidatorsFromAssemblyContaining<PlayerModel>());
builder.Services.AddControllers()
    .AddFluentValidation(c => c.RegisterValidatorsFromAssemblyContaining<MatchModel>());
builder.Services.AddControllers()
    .AddFluentValidation(c => c.RegisterValidatorsFromAssemblyContaining<MatchEventsModel>());
builder.Services.AddControllers()
    .AddFluentValidation(c => c.RegisterValidatorsFromAssemblyContaining<PlayerStatisticsModel>());
builder.Services.AddControllers()
    .AddFluentValidation(c => c.RegisterValidatorsFromAssemblyContaining<LeagueStandingsModel>());

// Register repositories and other dependencies
builder.Services.AddScoped<UsersRepository>();
builder.Services.AddScoped<LeagueRepository>();
builder.Services.AddScoped<TeamRepository>();
builder.Services.AddScoped<PlayerRepository>();
builder.Services.AddScoped<MatchRepository>();
builder.Services.AddScoped<MatchEventsRepository>();
builder.Services.AddScoped<PlayerStatisticsRepository>();
builder.Services.AddScoped<LeagueStandingsRepository>();

// Register Cloudinary configuration and service
builder.Services.AddSingleton<CloudinaryService>();
var cloudinarySettings = builder.Configuration.GetSection("Cloudinary");
var cloudinaryAccount = new Account(
    cloudinarySettings["CloudName"],
    cloudinarySettings["ApiKey"],
    cloudinarySettings["ApiSecret"]
);
var cloudinary = new Cloudinary(cloudinaryAccount);
builder.Services.AddSingleton(cloudinary);

// Add Swagger for API documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Bharat League API", Version = "v1" });
    c.OperationFilter<SwaggerFileUploadOperationFilter>(); // Register the filter for file uploads
});


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
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Bharat League API V1");
    });
}

// Use HTTPS redirection only in non-development environments
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
    app.UseDeveloperExceptionPage();
}

// Enable Authentication and Authorization
app.UseAuthentication();  // Add this line to use JWT Authentication
app.UseAuthorization();   

// Map controllers to API endpoints
app.MapControllers();

app.Run();
