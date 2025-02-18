using FluentValidation;
using backend.Models;
using System;

namespace backend.Validator
{
    public class PlayerValidator : AbstractValidator<PlayerModel>
    {
        public PlayerValidator()
        {
            RuleFor(player => player.TeamId)
                .GreaterThan(0)
                .WithMessage("TeamId must be greater than 0.");

            RuleFor(player => player.PlayerName)
                .NotEmpty()
                .WithMessage("Player name is required.")
                .MaximumLength(100)
                .WithMessage("Player name must not exceed 100 characters.");

            RuleFor(player => player.Age)
                .InclusiveBetween(16, 60)
                .WithMessage("Age must be between 16 and 60.");

            RuleFor(player => player.JerseyNumber)
                .InclusiveBetween(0, 99)
                .WithMessage("Jersey number must be between 0 and 99.");

            RuleFor(player => player.Position)
                .NotEmpty()
                .WithMessage("Position is required.")
                .MaximumLength(50)
                .WithMessage("Position must not exceed 50 characters.");
        }
    }
}
