<?php

namespace App\Controller;

use App\Entity\Client;
use App\Entity\Restaurant;
use App\Entity\User;
use App\Form\RegistrationFormType;
use App\Repository\RestaurantRepository;
use App\Repository\ScheduleRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

class RegistrationController extends AbstractController
{
    #[Route('/register', name: 'app_register')]
    public function register(Request $request, 
    UserPasswordHasherInterface $userPasswordHasher, 
    EntityManagerInterface $entityManager, 
    UserRepository $allUser,
    ScheduleRepository $scheduleRepository, RestaurantRepository $restaurantRepository,
    Security $security): Response
    {
        $user = new User();
        $form = $this->createForm(RegistrationFormType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            //Make sure the first suscriber is the Admin if they are Admin, relation to the restaurant table, otherwise relation to the client DB
            if ($allUser->isUserFirstSuscriber()){
                $user->setRoles(['ROLE_ADMIN']);
                
                $restaurant = new Restaurant();
                $restaurant->setUserId($user);
                $restaurant->setAddress($form->get('address')->getData());
                $restaurant->setPostCode($form->get('post_code')->getData());
                $restaurant->setCity($form->get('city')->getData());
                $restaurant->setPhone($form->get('phone')->getData());
                $entityManager->persist($restaurant);
                
                // populated schedule with dummy data
                // setting flush to false as there is also the password to persist
                $scheduleRepository->populateSchedule(false);
            } else {
                $client = new Client();
                $client->setUserId($user);
                $client->setAllergies($form->get('allergies')->getData());
                $client->setNumber($form->get('number')->getData());
                $entityManager->persist($client);
            }
            
            // encode the plain password
            $user->setPassword(
                $userPasswordHasher->hashPassword(
                    $user,
                    $form->get('plainPassword')->getData()
                )
            );

            $entityManager->persist($user);
            $entityManager->flush();
            // do anything else you need here, like send an email
            $security->login($user);

            if(in_array("ROLE_ADMIN", $user->getRoles())){
                return $this->redirectToRoute('app_admin_restaurant');
            } else {
                return $this->redirectToRoute('app_user_profil');
            }
        }
        $info = $restaurantRepository->findAll();if(count($info) === 0){
            $restaurantInfo = false;
        } else {
            $restaurantInfo = $info[0];
        }
        $schedule = $scheduleRepository->findAll();
        return $this->render('registration/register.html.twig', [
            'registrationForm' => $form->createView(),
            'schedule' => $schedule,
            'info' => $restaurantInfo,
            'first_suscriber' => $allUser->isUserFirstSuscriber()
        ]);
    }
}
