using FluentValidation;
using backend.Models;
using System;

namespace backend.Validator
{
    public class TeamValidator : AbstractValidator<TeamModel>
    {
        public TeamValidator()
        {
            RuleFor(x => x.LeagueId)
                .GreaterThan(0).WithMessage("League ID is required and must be valid.");

            RuleFor(x => x.TeamName)
                .NotEmpty().WithMessage("Team name is required.")
                .MaximumLength(100).WithMessage("Team name cannot exceed 100 characters.");

            RuleFor(x => x.ImageUrl)
                .MaximumLength(2048).WithMessage("Image URL cannot exceed 2048 characters.")
                .When(x => !string.IsNullOrEmpty(x.ImageUrl));

            RuleFor(x => x.City)
                .MaximumLength(50).WithMessage("City name cannot exceed 50 characters.")
                .When(x => !string.IsNullOrEmpty(x.City));

            RuleFor(x => x.CoachName)
                .MaximumLength(50).WithMessage("Coach name cannot exceed 50 characters.")
                .When(x => !string.IsNullOrEmpty(x.CoachName));

            RuleFor(x => x.FoundedYear)
                .InclusiveBetween(1801, DateTime.Now.Year).WithMessage($"Founded year must be between 1801 and {DateTime.Now.Year}.");
        }
    }
}
