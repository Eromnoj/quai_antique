<?php

namespace App\Entity;

use App\Repository\BookingRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: BookingRepository::class)]
class Booking
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: "Un nom est obligatoire")]
    #[Assert\Regex('/<[a-z][\s\S]*>/i', match:false, message: "Les balises HTML sont interdites")]
    private ?string $lastname = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: "Un prénom est obligatoire")]
    #[Assert\Regex('/<[a-z][\s\S]*>/i', match:false, message: "Les balises HTML sont interdites")]
    private ?string $firstname = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: "Une adresse email est obligatoire")]
    #[Assert\Email(message: "Veuillez entrer une adresse email valide")]
    private ?string $email = null;

    #[ORM\Column]
    #[Assert\NotBlank(message: "Vous devez indiquer un nombre de couverts")]
    #[Assert\GreaterThan(value: 0, message: "veuillez indiquer un nombre supérieur à {{ value }}")]
    private ?int $number = null;

    #[ORM\Column]
    #[Assert\NotBlank(message: "Vous devez indiquer un numéro de téléphone")]
    #[Assert\Regex('/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/', message: "Veuillez indiquer un numéro de téléphone valide")]
    private ?string $phone = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Assert\NotBlank(message: "Veuillez choisir une date de réservation")]
    #[Assert\GreaterThan(value: 'yesterday', message: "Veuillez choisir une date à partir d'aujourd'hui")]
    private ?\DateTimeInterface $date = null;

    #[ORM\Column(type: Types::TIME_MUTABLE)]
    #[Assert\NotBlank(message: "Veuillez choisir une heure d'arrivée")]
    private ?\DateTimeInterface $time = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Assert\Regex('/<[a-z][\s\S]*>/i', match:false, message: "Les balises HTML sont interdites")]
    private ?string $allergies = null;

    #[ORM\Column(length: 255)]
    #[Assert\Choice(options: ['midi', 'soir'], message: "Veuillez choisir un service")]
    private ?string $shift = null;



    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(string $lastname): self
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getNumber(): ?int
    {
        return $this->number;
    }

    public function setNumber(int $number): self
    {
        $this->number = $number;

        return $this;
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(string $phone): self
    {
        $this->phone = $phone;

        return $this;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): self
    {
        $this->date = $date;

        return $this;
    }

    public function getTime(): ?\DateTimeInterface
    {
        return $this->time;
    }

    public function setTime(\DateTimeInterface $time): self
    {
        $this->time = $time;

        return $this;
    }

    public function getAllergies(): ?string
    {
        return $this->allergies;
    }

    public function setAllergies(?string $allergies): self
    {
        $this->allergies = $allergies;

        return $this;
    }

    public function getShift(): ?string
    {
        return $this->shift;
    }

    public function setShift(string $shift): self
    {
        $this->shift = $shift;

        return $this;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(string $firstname): self
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }
}
