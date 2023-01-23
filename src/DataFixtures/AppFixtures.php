<?php

namespace App\DataFixtures;

use App\Entity\Booking;
use App\Entity\Client;
use App\Entity\Gallery;
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

        $user = Array();

        for ($i= 0; $i <3 ; $i++){
            $user[$i] = new User();
            
            if($i == 0){
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

            $user[$i]->setPassword($this->userPasswordHasher->hashPassword($user[$i],'azerty'));
            
            $manager->persist($user[$i]);
        }

        //Booking 
        // 
        // 
        $booking = array();

        for($i = 0; $i < 11; $i++){
            $booking[$i] = new Booking();

            $booking[$i]->setLastname($faker->lastName);
            $booking[$i]->setNumber($faker->randomDigitNotNull);
            $booking[$i]->setPhone($faker->phoneNumber);
            $booking[$i]->setDate($faker->dateTimeBetween('now','+ 10 days'));
            $booking[$i]->setTime($faker->dateTime());
            $booking[$i]->setAllergies($faker->words(3, true));

            if($i % 3 == 0){
                $booking[$i]->setShift('midi');
            } else {
                $booking[$i]->setShift('soir');
            }

            $manager->persist($booking[$i]);
        }

        // Schedule
        // 
        // 
        $days = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'];

        $schedule = array();

        for($i= 0; $i < count($days); $i++){
            $schedule[$i] = new Schedule();

            $schedule[$i]->setDay($days[$i]);
            $i <= 4 ? $schedule[$i]->setNoonOpen(true) : $schedule[$i]->setNoonOpen(false);
            $schedule[$i]->setNoonStart(new DateTime('12:00'));
            $schedule[$i]->setNoonEnd(new DateTime('15:00'));
            $i >= 4 && $i < 6 ? $schedule[$i]->setEveningOpen(true) : $schedule[$i]->setEveningOpen(false);
            $schedule[$i]->setEveningStart(new DateTime('18:00'));
            $schedule[$i]->setEveningEnd(new DateTime('22:00'));
        
            $manager->persist($schedule[$i]);
        }


        // Gallery
        // 
        // 
        $images = ['img/image_un.jpg','img/image_deux.jpg','img/image_trois.jpg'];

        $gallery = array();

        for($i = 0; $i < count($images); $i++){
            $gallery[$i] = new Gallery();

            $gallery[$i]->setUrl($images[$i]);
            $gallery[$i]->setDescription($faker->words(4, true));

            $manager->persist($gallery[$i]);
        }

        $manager->flush();
    }
}
