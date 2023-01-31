<?php

namespace App\Entity;

use App\Repository\MenuRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: MenuRepository::class)]
class Menu
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['get_menu_with_formulas'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['get_menu_with_formulas'])]
    #[Assert\NotBlank(message:"Vous devez choisir un nom de menu")]
    private ?string $name = null;

    #[ORM\OneToMany(mappedBy: 'menu', targetEntity: Formula::class, orphanRemoval: true)]
    #[Groups(['get_menu_with_formulas'])]
    private Collection $formulas;

    public function __construct()
    {
        $this->formulas = new ArrayCollection();
    }

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

    /**
     * @return Collection<int, Formula>
     */
    public function getFormulas(): Collection
    {
        return $this->formulas;
    }

    public function addFormula(Formula $formula): self
    {
        if (!$this->formulas->contains($formula)) {
            $this->formulas->add($formula);
            $formula->setMenu($this);
        }

        return $this;
    }

    public function removeFormula(Formula $formula): self
    {
        if ($this->formulas->removeElement($formula)) {
            // set the owning side to null (unless already changed)
            if ($formula->getMenu() === $this) {
                $formula->setMenu(null);
            }
        }

        return $this;
    }
}
