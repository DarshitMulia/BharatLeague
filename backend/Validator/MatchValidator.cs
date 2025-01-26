using FluentValidation;
using backend.Models;
using System;

namespace backend.Validator
{
    public class MatchValidator : AbstractValidator<MatchModel>
    {
        public MatchValidator()
        {
            RuleFor(x => x.LeagueId)
                .GreaterThan(0).WithMessage("League ID is required and must be valid.");

            RuleFor(x => x.Team1Id)
                .GreaterThan(0).WithMessage("Team1 ID is required and must be valid.");

            RuleFor(x => x.Team2Id)
                .GreaterThan(0).WithMessage("Team2 ID is required and must be valid.");

            //RuleFor(x => x.MatchDate)
            //    .GreaterThanOrEqualTo(DateTime.Now).WithMessage("Match date must be a future date.");

            RuleFor(x => x.Venue)
                .NotEmpty().WithMessage("Venue is required.")
                .MaximumLength(100).WithMessage("Venue name cannot exceed 100 characters.");
        }
    }
}
