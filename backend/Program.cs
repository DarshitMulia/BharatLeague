using backend.Data;
using FluentValidation;
using FluentValidation.AspNetCore;
using backend.Models;
using backend.Controllers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using CloudinaryDotNet;
using backend.Services;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add controllers and register all validators in one call.
builder.Services.AddControllers().AddFluentValidation(c =>
{
    // Scan the assemblies that contain your models/validators.
    c.RegisterValidatorsFromAssemblyContaining<UsersModel>();
    c.RegisterValidatorsFromAssemblyContaining<LeagueModel>();
    c.RegisterValidatorsFromAssemblyContaining<TeamModel>();
    c.RegisterValidatorsFromAssemblyContaining<PlayerModel>();
    c.RegisterValidatorsFromAssemblyContaining<MatchModel>();
    c.RegisterValidatorsFromAssemblyContaining<MatchEventsModel>();
    c.RegisterValidatorsFromAssemblyContaining<PlayerStatisticsModel>();
    c.RegisterValidatorsFromAssemblyContaining<LeagueStandingsModel>();
});

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
    c.OperationFilter<SwaggerFileUploadOperationFilter>(); // Filter for file uploads

    // Configure JWT Authentication support in Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] { }
        }
    });
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

// Configure CORS to allow your React frontend
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
else
{
    app.UseHttpsRedirection();
    app.UseDeveloperExceptionPage();
}

// Enable Authentication and Authorization
app.UseAuthentication();
app.UseAuthorization();

// Map controllers to endpoints
app.MapControllers();

app.Run();
