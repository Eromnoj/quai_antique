<?php

namespace App\Controller;

use App\Repository\RestaurantRepository;
use App\Repository\ScheduleRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/user')]
class UserController extends AbstractController
{
    #[Route('/profil', name: 'app_user_profil')]
    public function profil(ScheduleRepository $scheduleRepository, RestaurantRepository $restaurantRepository): Response
    {
        $info = $restaurantRepository->findAll();
        $schedule = $scheduleRepository->findAll();
        return $this->render('user/profil.html.twig', [
            'schedule' => $schedule,
            'info' => $info[0]
        ]);
    }

    #[Route('/account', name: 'app_user_account')]
    public function account(ScheduleRepository $scheduleRepository, RestaurantRepository $restaurantRepository): Response
    {
        $info = $restaurantRepository->findAll();
        $schedule = $scheduleRepository->findAll();
        return $this->render('user/account.html.twig', [
            'schedule' => $schedule,
            'info' => $info[0]
        ]);
    }
}
