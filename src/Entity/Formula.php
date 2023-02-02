<?php

namespace App\Entity;

use App\Repository\FormulaRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: FormulaRepository::class)]
class Formula
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['get_menu_with_formulas'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['get_menu_with_formulas'])]
    #[Assert\NotBlank(message:"Vous devez choisir un nom de formules")]
    private ?string $name = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['get_menu_with_formulas'])]
    #[Assert\NotBlank(message:"Vous devez indiquer une description")]
    private ?string $description = null;

    #[ORM\Column]
    #[Groups(['get_menu_with_formulas'])]
    #[Assert\NotBlank(message:"Vous devez préciser un prix")]
    #[Assert\GreaterThan(value:0, message: "veuillez indiquer un nombre supérieur à {{ value }}")]
    private ?float $price = null;

    #[ORM\ManyToOne(inversedBy: 'formulas')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Menu $menu = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(float $price): self
    {
        $this->price = $price;

        return $this;
    }

    public function getMenu(): ?Menu
    {
        return $this->menu;
    }

    public function setMenu(?Menu $menu): self
    {
        $this->menu = $menu;

        return $this;
    }
}
