<?php

namespace App\Entity;

use App\Repository\ScheduleRepository;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\DBAL\Types\Types;
#[ORM\Entity(repositoryClass: ScheduleRepository::class)]
class Schedule
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $day = null;

    #[ORM\Column(type: Types::TIME_MUTABLE)]
    private ?\DateTimeInterface $noonStart = null;

    #[ORM\Column(type: Types::TIME_MUTABLE)]
    private ?\DateTimeInterface $noonEnd = null;

    #[ORM\Column]
    private ?bool $noonClosed = null;

    #[ORM\Column(type: Types::TIME_MUTABLE)]
    private ?\DateTimeInterface $eveningStart = null;

    #[ORM\Column(type: Types::TIME_MUTABLE)]
    private ?\DateTimeInterface $eveningEnd = null;

    #[ORM\Column]
    private ?bool $eveningClosed = null;

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

    public function getNoonStart(): ?\DateTimeInterface
    {
        return $this->noonStart;
    }

    public function setNoonStart(\DateTimeInterface $noonStart): self
    {
        $this->noonStart = $noonStart;

        return $this;
    }

    public function getNoonEnd(): ?\DateTimeInterface
    {
        return $this->noonEnd;
    }

    public function setNoonEnd(\DateTimeInterface $noonEnd): self
    {
        $this->noonEnd = $noonEnd;

        return $this;
    }

    public function isNoonClosed(): ?bool
    {
        return $this->noonClosed;
    }

    public function setNoonClosed(bool $noonClosed): self
    {
        $this->noonClosed = $noonClosed;

        return $this;
    }

    public function getEveningStart(): ?\DateTimeInterface
    {
        return $this->eveningStart;
    }

    public function setEveningStart(\DateTimeInterface $eveningStart): self
    {
        $this->eveningStart = $eveningStart;

        return $this;
    }

    public function getEveningEnd(): ?\DateTimeInterface
    {
        return $this->eveningEnd;
    }

    public function setEveningEnd(\DateTimeInterface $eveningEnd): self
    {
        $this->eveningEnd = $eveningEnd;

        return $this;
    }

    public function isEveningClosed(): ?bool
    {
        return $this->eveningClosed;
    }

    public function setEveningClosed(bool $eveningClosed): self
    {
        $this->eveningClosed = $eveningClosed;

        return $this;
    }
}
