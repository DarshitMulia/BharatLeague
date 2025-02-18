using FluentValidation;
using backend.Models;
using System;
using System.Linq;

namespace backend.Validator
{
    public class MatchEventsValidator : AbstractValidator<MatchEventsModel>
    {
        public MatchEventsValidator()
        {
            RuleFor(x => x.MatchId)
                .GreaterThan(0)
                .WithMessage("MatchId must be greater than 0.");

            RuleFor(x => x.TeamId)
                .GreaterThan(0)
                .WithMessage("TeamId must be greater than 0.");

            RuleFor(x => x.PlayerId)
                .GreaterThan(0)
                .When(x => x.PlayerId.HasValue)
                .WithMessage("PlayerId, if provided, must be greater than 0.");

            RuleFor(x => x.EventType)
                .NotEmpty()
                .WithMessage("EventType is required.")
                .MaximumLength(50)
                .WithMessage("EventType must not exceed 50 characters.")
                .Must(BeAValidEventType)
                .WithMessage("EventType must be one of the following: Goal, Assist, Foul, Yellow Card, Red Card.");

            RuleFor(x => x.EventTime)
                .InclusiveBetween(0, 150)
                .WithMessage("EventTime must be between 0 and 150 minutes.");

            RuleFor(x => x.AdditionalInfo)
                .MaximumLength(250)
                .When(x => !string.IsNullOrEmpty(x.AdditionalInfo))
                .WithMessage("AdditionalInfo must not exceed 250 characters.");
        }

        private bool BeAValidEventType(string eventType)
        {
            string[] allowedTypes = { "Goal", "Assist", "Foul", "Yellow Card", "Red Card"};
            return allowedTypes.Any(type => string.Equals(type, eventType, StringComparison.OrdinalIgnoreCase));
        }
    }
}
