using FluentValidation;
using backend.Models;

namespace backend.Validator
{
    public class MatchEventsValidator : AbstractValidator<MatchEventsModel>
    {
        public MatchEventsValidator()
        {
            RuleFor(x => x.MatchId)
                .GreaterThan(0).WithMessage("Match ID is required and must be valid.");

            RuleFor(x => x.PlayerId)
                .GreaterThan(0).WithMessage("Player ID is required and must be valid.");

            RuleFor(x => x.EventType)
                .NotEmpty().WithMessage("Event type is required.")
                .MaximumLength(50).WithMessage("Event type cannot exceed 50 characters.");

            RuleFor(x => x.EventTime)
                .GreaterThanOrEqualTo(0).WithMessage("Event time must be non-negative.")
                .LessThanOrEqualTo(120).WithMessage("Event time must be within the duration of a standard match (0-120 minutes).");

            RuleFor(x => x.CreatedAt)
                .LessThanOrEqualTo(DateTime.UtcNow).WithMessage("CreatedAt cannot be a future date.");

            RuleFor(x => x.UpdatedAt)
                .LessThanOrEqualTo(DateTime.UtcNow).WithMessage("UpdatedAt cannot be a future date.");
        }
    }
}
