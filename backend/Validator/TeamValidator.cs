using FluentValidation;
using backend.Models;
using System;

namespace backend.Validator
{
    public class TeamValidator : AbstractValidator<TeamModel>
    {
        public TeamValidator()
        {
            RuleFor(team => team.LeagueId)
                .GreaterThan(0)
                .WithMessage("LeagueId must be greater than 0.");

            RuleFor(team => team.TeamName)
                .NotEmpty()
                .WithMessage("Team name is required.")
                .MaximumLength(100)
                .WithMessage("Team name must not exceed 100 characters.");

            RuleFor(team => team.City)
                .NotEmpty()
                .WithMessage("City is required.")
                .MaximumLength(50)
                .WithMessage("City must not exceed 50 characters.");

            RuleFor(team => team.CoachName)
                .NotEmpty()
                .WithMessage("Coach name is required.")
                .MaximumLength(100)
                .WithMessage("Coach name must not exceed 100 characters.");

            RuleFor(team => team.FoundedYear)
                .InclusiveBetween(1800, DateTime.Now.Year)
                .WithMessage($"Founded year must be between 1800 and {DateTime.Now.Year}.");
        }
    }
}
