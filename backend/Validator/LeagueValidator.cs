using FluentValidation;
using backend.Models;
using System;

namespace backend.Validator
{
    public class LeagueValidator : AbstractValidator<LeagueModel>
    {
        public LeagueValidator()
        {
            RuleFor(x => x.UserId)
                .GreaterThan(0).WithMessage("User ID is required and must be valid.");

            RuleFor(x => x.LeagueName)
                .NotEmpty().WithMessage("League name is required.")
                .MaximumLength(100).WithMessage("League name cannot exceed 100 characters.");

            RuleFor(x => x.Country)
                .MaximumLength(50).WithMessage("Country name cannot exceed 50 characters.");

            RuleFor(x => x.StartDate)
                .LessThan(x => x.EndDate).WithMessage("Start date must be earlier than end date.")
                .GreaterThanOrEqualTo(DateTime.Today).WithMessage("Start date must not be in the past.");

            RuleFor(x => x.EndDate)
                .GreaterThan(x => x.StartDate).WithMessage("End date must be later than start date.");
        }
    }
}