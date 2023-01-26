<?php

namespace App\DataFixtures;

use App\Entity\Booking;
use App\Entity\Category;
use App\Entity\Client;
use App\Entity\Dish;
use App\Entity\Formula;
use App\Entity\Gallery;
use App\Entity\Menu;
use App\Entity\Restaurant;
use App\Entity\Schedule;
use App\Entity\User;
use DateTime;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

use Faker;

class AppFixtures extends Fixture
{

    private ?UserPasswordHasherInterface $userPasswordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->userPasswordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager): void
    {
        // $product = new Product();
        // $manager->persist($product);

        $faker = Faker\Factory::create('fr_FR');

        //create Users with Client info + Restaurant info 
        // 
        // 

        $user = array();

        for ($i = 0; $i < 3; $i++) {
            $user[$i] = new User();

            if ($i == 0) {
                $user[$i]->setRoles(['ROLE_ADMIN']);

                $user[$i]->setEmail('admin@lequaiantique.fr');

                $restaurant = new Restaurant();
                $restaurant->setUserId($user[$i]);
                $restaurant->setAddress('10 avenue de la raclette');
                $restaurant->setPostCode(73000);
                $restaurant->SetCity('Chambéry');
                $restaurant->setPhone("0487123456");
                $restaurant->setMaxCapacity(40);

                $manager->persist($restaurant);
            } else {
                $user[$i]->setEmail($faker->email);

                $client = new Client();
                $client->setUserId($user[$i]);
                $client->setLastname($faker->lastName);
                $client->setFirstname($faker->firstName);
                $client->setAllergies($faker->words(3, true));
                $client->setPhone($faker->phoneNumber);
                $client->setNumber($faker->randomDigitNotNull);
                $manager->persist($client);
            }

            $user[$i]->setPassword($this->userPasswordHasher->hashPassword($user[$i], 'azerty'));

            $manager->persist($user[$i]);
        }

        //Booking 
        // 
        // 
        $booking = array();

        for ($i = 0; $i < 11; $i++) {
            $booking[$i] = new Booking();

            $booking[$i]->setLastname($faker->lastName);
            $booking[$i]->setNumber($faker->randomDigitNotNull);
            $booking[$i]->setPhone($faker->phoneNumber);
            $booking[$i]->setDate($faker->dateTimeBetween('now', '+ 10 days'));
            $booking[$i]->setTime($faker->dateTime());
            $booking[$i]->setAllergies($faker->words(3, true));

            if ($i % 3 == 0) {
                $booking[$i]->setShift('midi');
            } else {
                $booking[$i]->setShift('soir');
            }

            $manager->persist($booking[$i]);
        }

        // Schedule
        // 
        // 
        $days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

        $schedule = array();

        for ($i = 0; $i < count($days); $i++) {
            $schedule[$i] = new Schedule();

            $schedule[$i]->setDay($days[$i]);
            $i <= 4 ? $schedule[$i]->setNoonClosed(false) : $schedule[$i]->setNoonClosed(true);
            $schedule[$i]->setNoonStart('12:00');
            $schedule[$i]->setNoonEnd('15:00');
            $i >= 4 && $i < 6 ? $schedule[$i]->setEveningClosed(false) : $schedule[$i]->setEveningClosed(true);
            $schedule[$i]->setEveningStart('18:00');
            $schedule[$i]->setEveningEnd('22:00');

            $manager->persist($schedule[$i]);
        }


        // Gallery
        // 
        // 
        $images = ['image_un.jpg', 'image_deux.jpg', 'image_trois.jpg'];

        $gallery = array();

        for ($i = 0; $i < count($images); $i++) {
            $gallery[$i] = new Gallery();

            $gallery[$i]->setUrl($images[$i]);
            $gallery[$i]->setDescription($faker->words(4, true));

            $manager->persist($gallery[$i]);
        }


        // Categories and Dishes
        // 
        // 
        $dishList = [
            [
                "Entrées", [
                    [
                        "name" => "Saumon fumé",
                        "description" => "Fumage au bois de sapin des Alpes",
                        "price" => 13
                    ],
                    [
                        "name" => "Foie gras",
                        "description" => "Tranches de foie gras poêlées en terrine",
                        "price" => 18
                    ],
                    [
                        "name" => "Salade Savoyarde",
                        "description" => "Salade gourmande avec ventrèche et reblochon",
                        "price" => 12
                    ]
                ]
            ],
            [
                "Plats", [
                    [
                        "name" => "Chamois Farci",
                        "description" => "Accompagnée de pommes de terre au four",
                        "price" => 26
                    ],
                    [
                        "name" => "Potée du randonneur",
                        "description" => "Potée savoyarde accompagnée d'une crème à la raclette et croûtons",
                        "price" => 22
                    ],
                    [
                        "name" => "Truite grillée",
                        "description" => "Avec poêlée de légumes rustiques",
                        "price" => 19
                    ]
                ]
            ],
            [
                "Dessert", [
                    [
                        "name" => "Mont Blanc gourmand",
                        "description" => "Crème de noisette, croquants et meringues fondantes, coulis de chocolat blanc",
                        "price" => 26
                    ],
                    [
                        "name" => "Salade de fruits",
                        "description" => "Salade de fruits de saison, sirop à la vanille et Crème fouttée AOP",
                        "price" => 22
                    ],
                    [
                        "name" => "Café ou thé gourmand",
                        "description" => "Accompagnée de mignardises maison",
                        "price" => 19
                    ]
                ]
            ]
        ];

        $category = array();
        $dish = array();


        for ($i = 0; $i < count($dishList); $i++) {
            $category[$i] = new Category();
            $category[$i]->setName($dishList[$i][0]);
            $category[$i]->setRankDisplay($i + 1);
            $manager->persist($category[$i]);

            for ($j = 0; $j < count($dishList[$i][1]); $j++) {
                $posInArray = count($dish);
                $dish[$posInArray] = new Dish();
                $dish[$posInArray]->setName($dishList[$i][1][$j]['name']);
                $dish[$posInArray]->setDescription($dishList[$i][1][$j]['description']);
                $dish[$posInArray]->setPrice($dishList[$i][1][$j]['price']);
                $dish[$posInArray]->setCategory($category[$i]);
                $manager->persist($dish[$posInArray]);
            }
        }

        // Menus and Formulas
        // 
        // 
        $menusList = [
            [
                "Menu de Saison", [
                    [
                        "name" => "Midi",
                        "description" => "Entrée + Plat + dessert",
                        "price" => 32
                    ],
                    [
                        "name" => "Soir",
                        "description" => "Entrée + Plat + dessert",
                        "price" => 44
                    ]
                ]
            ],
            [
                "Menu des Chefs", [
                    [
                        "name" => "L'expérience",
                        "description" => "Une dégustation en Sept plats de l'entrée au dessert",
                        "price" => 55
                    ],
                    [
                        "name" => "Le Gargantua",
                        "description" => "Douze plats, de l'entrée au dessert. Bouteille de vin offerte",
                        "price" => 99
                    ]
                ]
            ]
        ];

        $menu = array();
        $formulas = array();

        for ($i = 0; $i < count($menusList); $i++) {
            $menu[$i] = new Menu();
            $menu[$i]->setName($menusList[$i][0]);
            $manager->persist($menu[$i]);

            for ($j = 0; $j < count($menusList[$i][1]); $j++) {
                $posInArray = count($formulas);
                $formulas[$posInArray] = new Formula();
                $formulas[$posInArray]->setName($menusList[$i][1][$j]['name']);
                $formulas[$posInArray]->setDescription($menusList[$i][1][$j]['description']);
                $formulas[$posInArray]->setPrice($menusList[$i][1][$j]['price']);
                $formulas[$posInArray]->setMenu($menu[$i]);
                $manager->persist($formulas[$posInArray]);
            }
        }

        $manager->flush();
    }
}
