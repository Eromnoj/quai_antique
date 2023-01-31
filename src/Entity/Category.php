<?php

namespace App\Entity;

use App\Repository\CategoryRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: CategoryRepository::class)]
class Category
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['get_category_with_dishes', 'get_category', 'get_dishes'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['get_category_with_dishes', 'get_category', 'get_dishes'])]
    #[Assert\NotBlank(message:"Veuillez indiquer un nom pour la catégorie")]
    private ?string $name = null;

    #[ORM\Column]
    #[Groups(['get_category_with_dishes', 'get_category', 'get_dishes'])]
    #[Assert\NotBlank(message:"Vous devez indiquer un rang pour l'ordre d'affichage")]
    private ?int $rank_display = null;

    #[ORM\OneToMany(mappedBy: 'category', targetEntity: Dish::class, orphanRemoval: true)]
    #[Groups(['get_category_with_dishes'])]
    private Collection $dishes;

    public function __construct()
    {
        $this->dishes = new ArrayCollection();
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

    public function getRankDisplay(): ?int
    {
        return $this->rank_display;
    }

    public function setRankDisplay(int $rank_display): self
    {
        $this->rank_display = $rank_display;

        return $this;
    }

    /**
     * @return Collection<int, Dish>
     */
    public function getDishes(): Collection
    {
        return $this->dishes;
    }

    public function addDish(Dish $dish): self
    {
        if (!$this->dishes->contains($dish)) {
            $this->dishes->add($dish);
            $dish->setCategory($this);
        }

        return $this;
    }

    public function removeDish(Dish $dish): self
    {
        if ($this->dishes->removeElement($dish)) {
            // set the owning side to null (unless already changed)
            if ($dish->getCategory() === $this) {
                $dish->setCategory(null);
            }
        }

        return $this;
    }
}
