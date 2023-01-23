<?php

namespace App\Entity;

use App\Repository\ScheduleRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ScheduleRepository::class)]
class Schedule
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $day = null;

    #[ORM\Column]
    private ?bool $noon_open = null;

    #[ORM\Column(type: Types::TIME_MUTABLE)]
    private ?\DateTimeInterface $noon_start = null;

    #[ORM\Column(type: Types::TIME_MUTABLE)]
    private ?\DateTimeInterface $noon_end = null;

    #[ORM\Column]
    private ?bool $evening_open = null;

    #[ORM\Column(type: Types::TIME_MUTABLE)]
    private ?\DateTimeInterface $evening_start = null;

    #[ORM\Column(type: Types::TIME_MUTABLE)]
    private ?\DateTimeInterface $evening_end = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDay(): ?string
    {
        return $this->day;
    }

    public function setDay(string $day): self
    {
        $this->day = $day;

        return $this;
    }

    public function isNoonOpen(): ?bool
    {
        return $this->noon_open;
    }

    public function setNoonOpen(bool $noon_open): self
    {
        $this->noon_open = $noon_open;

        return $this;
    }

    public function getNoonStart(): ?\DateTimeInterface
    {
        return $this->noon_start;
    }

    public function setNoonStart(\DateTimeInterface $noon_start): self
    {
        $this->noon_start = $noon_start;

        return $this;
    }

    public function getNoonEnd(): ?\DateTimeInterface
    {
        return $this->noon_end;
    }

    public function setNoonEnd(\DateTimeInterface $noon_end): self
    {
        $this->noon_end = $noon_end;

        return $this;
    }

    public function isEveningOpen(): ?bool
    {
        return $this->evening_open;
    }

    public function setEveningOpen(bool $evening_open): self
    {
        $this->evening_open = $evening_open;

        return $this;
    }

    public function getEveningStart(): ?\DateTimeInterface
    {
        return $this->evening_start;
    }

    public function setEveningStart(\DateTimeInterface $evening_start): self
    {
        $this->evening_start = $evening_start;

        return $this;
    }

    public function getEveningEnd(): ?\DateTimeInterface
    {
        return $this->evening_end;
    }

    public function setEveningEnd(\DateTimeInterface $evening_end): self
    {
        $this->evening_end = $evening_end;

        return $this;
    }
}
