using FluentValidation;
using backend.Models;
using System;
using System.Linq;

namespace backend.Validator
{
    public class LeagueValidator : AbstractValidator<LeagueModel>
    {
        public LeagueValidator()
        {
            RuleFor(x => x.UserId)
                .GreaterThan(0);

            RuleFor(x => x.LeagueName)
                .NotEmpty()
                .MinimumLength(3)
                .MaximumLength(100);

            RuleFor(x => x.Country)
                .NotEmpty()
                .MinimumLength(2)
                .MaximumLength(100);

            RuleFor(x => x.StartDate)
                .GreaterThanOrEqualTo(_ => DateTime.Now)
                .WithMessage("StartDate cannot be in the past.")
                .LessThan(x => x.EndDate)
                .WithMessage("StartDate must be before EndDate.");

            RuleFor(x => x.EndDate)
                .GreaterThan(x => x.StartDate)
                .WithMessage("EndDate must be after StartDate.");

            RuleFor(x => x.Status)
                .NotEmpty()
                .Must(status => new[] { "Scheduled", "Ongoing", "Completed" }
                    .Contains(status, StringComparer.OrdinalIgnoreCase))
                .WithMessage("Status must be one of the following: Scheduled, Ongoing, Complete.");
        }
    }
}
