using FluentValidation;
using backend.Models;
using System;

namespace backend.Validator
{
    public class MatchValidator : AbstractValidator<MatchModel>
    {
        public MatchValidator()
        {
            RuleFor(match => match.LeagueId)
                .GreaterThan(0)
                .WithMessage("LeagueId must be greater than 0.");

            RuleFor(match => match.Team1Id)
                .GreaterThan(0)
                .WithMessage("Team1Id must be greater than 0.");

            RuleFor(match => match.Team2Id)
                .GreaterThan(0)
                .WithMessage("Team2Id must be greater than 0.");

            RuleFor(match => match)
                .Must(m => m.Team1Id != m.Team2Id)
                .WithMessage("Team1 and Team2 must be different teams.");

            RuleFor(match => match.MatchDate)
                .NotEqual(default(DateTime))
                .WithMessage("MatchDate must be a valid date.")
                .GreaterThanOrEqualTo(DateTime.Today)
                .WithMessage("MatchDate cannot be in the past.");

            RuleFor(match => match.StartTime)
                .InclusiveBetween(TimeSpan.Zero, new TimeSpan(23, 59, 59))
                .WithMessage("StartTime must be between 00:00:00 and 23:59:59.");

            RuleFor(match => match.Venue)
                .NotEmpty()
                .WithMessage("Venue is required.")
                .MaximumLength(150)
                .WithMessage("Venue must not exceed 150 characters.");

            RuleFor(match => match.Status)
                .NotEmpty()
                .WithMessage("Status is required.")
                .Must(BeAValidStatus)
                .WithMessage("Status must be one of the following: Scheduled, Ongoing, Completed.");
        }

        private bool BeAValidStatus(string status)
        {
            var allowedStatuses = new[] { "Scheduled", "Ongoing", "Completed" };
            return Array.Exists(allowedStatuses, s => s.Equals(status, StringComparison.OrdinalIgnoreCase));
        }
    }
}
