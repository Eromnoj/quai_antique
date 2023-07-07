<?php

namespace App\Entity;

use App\Repository\RestaurantRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: RestaurantRepository::class)]
class Restaurant
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['get_restaurant'])]
    private ?int $id = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    private ?User $user_id = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['get_restaurant'])]
    #[Assert\NotBlank(message:"Vous devez indiquer une adresse pour le restaurant")]
    #[Assert\Regex('/<[a-z][\s\S]*>/i', match:false, message: "Les balises HTML sont interdites")]
    private ?string $address = null;

    #[ORM\Column(length: 5, nullable: true)]
    #[Groups(['get_restaurant'])]
    #[Assert\NotBlank(message:"Vous devez indiquer un code postal")]
    #[Assert\Regex('/<[a-z][\s\S]*>/i', match:false, message: "Les balises HTML sont interdites")]
    private ?string $post_code = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['get_restaurant'])]
    #[Assert\NotBlank(message:"Vous devez indiquer la ville du restaurant")]
    #[Assert\Regex('/<[a-z][\s\S]*>/i', match:false, message: "Les balises HTML sont interdites")]
    private ?string $city = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['get_restaurant'])]
    #[Assert\NotBlank(message:"Vous devez indiquer un numéro de téléphone")]
    #[Assert\Regex('/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/', message: "Veuillez indiquer un numéro de téléphone valide")]
    private ?string $phone = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['get_restaurant'])]
    #[Assert\NotBlank(message:"Veuillez indiquer la capacité maximale pour un service")]
    #[Assert\GreaterThan(value:0, message: "veuillez indiquer un nombre supérieur à {{ value }}")]
    private ?int $max_capacity = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUserId(): ?User
    {
        return $this->user_id;
    }

    public function setUserId(?User $user_id): self
    {
        $this->user_id = $user_id;

        return $this;
    }

    public function getAddress(): ?string
    {
        return $this->address;
    }

    public function setAddress(?string $address): self
    {
        $this->address = $address;

        return $this;
    }

    public function getPostCode(): ?string
    {
        return $this->post_code;
    }

    public function setPostCode(?string $post_code): self
    {
        $this->post_code = $post_code;

        return $this;
    }

    public function getCity(): ?string
    {
        return $this->city;
    }

    public function setCity(?string $city): self
    {
        $this->city = $city;

        return $this;
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(?string $phone): self
    {
        $this->phone = $phone;

        return $this;
    }

    public function getMaxCapacity(): ?int
    {
        return $this->max_capacity;
    }

    public function setMaxCapacity(?int $max_capacity): self
    {
        $this->max_capacity = $max_capacity;

        return $this;
    }
}
