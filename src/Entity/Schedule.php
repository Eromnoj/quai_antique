<?php

namespace App\Entity;

use App\Repository\ScheduleRepository;
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

    #[ORM\Column(length: 6)]
    private ?string $noonStart = null;

    #[ORM\Column(length: 6)]
    private ?string $noonEnd = null;

    #[ORM\Column]
    private ?bool $noonClosed = null;

    #[ORM\Column(length: 6)]
    private ?string $eveningStart = null;

    #[ORM\Column(length: 6)]
    private ?string $eveningEnd = null;

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

    public function getNoonStart(): ?string
    {
        return $this->noonStart;
    }

    public function setNoonStart(string $noonStart): self
    {
        $this->noonStart = $noonStart;

        return $this;
    }

    public function getNoonEnd(): ?string
    {
        return $this->noonEnd;
    }

    public function setNoonEnd(string $noonEnd): self
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

    public function getEveningStart(): ?string
    {
        return $this->eveningStart;
    }

    public function setEveningStart(string $eveningStart): self
    {
        $this->eveningStart = $eveningStart;

        return $this;
    }

    public function getEveningEnd(): ?string
    {
        return $this->eveningEnd;
    }

    public function setEveningEnd(string $eveningEnd): self
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
