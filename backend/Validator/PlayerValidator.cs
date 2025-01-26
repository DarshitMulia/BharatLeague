using FluentValidation;
using backend.Models;

namespace backend.Validator
{
    public class PlayerValidator : AbstractValidator<PlayerModel>
    {
        public PlayerValidator()
        {
            RuleFor(x => x.TeamId)
                .GreaterThan(0).WithMessage("Team ID must be a valid and greater than 0.");

            RuleFor(x => x.PlayerName)
                .NotEmpty().WithMessage("Player name is required.")
                .MaximumLength(100).WithMessage("Player name cannot exceed 100 characters.");

            RuleFor(x => x.Age)
                .InclusiveBetween(1, 100).WithMessage("Age must be between 1 and 100.");

            RuleFor(x => x.JerseyNumber)
                .InclusiveBetween(1, 99).WithMessage("Jersey number must be between 1 and 99.");

            RuleFor(x => x.Position)
                .NotEmpty().WithMessage("Position is required.")
                .Must(position => new[] { "Forward", "Midfielder", "Defender", "Goalkeeper" }.Contains(position))
                .WithMessage("Position must be one of the following: Forward, Midfielder, Defender, Goalkeeper.");
        }
    }
}
