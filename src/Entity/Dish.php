<?php

namespace App\Entity;

use App\Repository\DishRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: DishRepository::class)]
class Dish
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['get_category_with_dishes', 'get_dishes'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['get_category_with_dishes', 'get_dishes'])]
    #[Assert\NotBlank(message:"Veuillez choisir un nom pour le plat")]
    private ?string $name = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['get_category_with_dishes', 'get_dishes'])]
    #[Assert\NotBlank(message:"Vous devez indiquer une description")]
    private ?string $description = null;

    #[ORM\Column]
    #[Groups(['get_category_with_dishes', 'get_dishes'])]
    #[Assert\NotBlank(message:"Vous devez préciser un prix")]
    private ?float $price = null;

    #[ORM\ManyToOne(inversedBy: 'dishes')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['get_dishes'])]
    #[Assert\NotBlank(message:"Vous devez choisir une catégorie pour le plat")]
    private ?Category $category = null;

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

    public function getCategory(): ?Category
    {
        return $this->category;
    }

    public function setCategory(?Category $category): self
    {
        $this->category = $category;

        return $this;
    }
}
