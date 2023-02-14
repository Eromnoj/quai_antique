<?php

namespace App\Controller;

use App\Repository\RestaurantRepository;
use App\Repository\ScheduleRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/admin')]
class AdminController extends AbstractController
{
    #[Route('/restaurant', name: 'app_admin_restaurant')]
    public function index(ScheduleRepository $scheduleRepository, RestaurantRepository $restaurantRepository): Response
    {
        $info = $restaurantRepository->findAll();
        if(count($info) === 0){
            $restaurantInfo = false;
        } else {
            $restaurantInfo = $info[0];
        }
        $schedule = $scheduleRepository->findAll();
        return $this->render('admin/restaurant.html.twig', [
            'schedule' => $schedule,
            'info' => $restaurantInfo
        ]);
    }

    #[Route('/lacarte', name: 'app_admin_dishes')]
    public function dishes(ScheduleRepository $scheduleRepository, RestaurantRepository $restaurantRepository): Response
    {
        $info = $restaurantRepository->findAll();
        if(count($info) === 0){
            $restaurantInfo = false;
        } else {
            $restaurantInfo = $info[0];
        }
        $schedule = $scheduleRepository->findAll();
        return $this->render('admin/dishes.html.twig', [
            'schedule' => $schedule,
            'info' => $restaurantInfo
        ]);
    }

    #[Route('/lesmenus', name: 'app_admin_menus')]
    public function menus(ScheduleRepository $scheduleRepository, RestaurantRepository $restaurantRepository): Response
    {
        $info = $restaurantRepository->findAll();
        if(count($info) === 0){
            $restaurantInfo = false;
        } else {
            $restaurantInfo = $info[0];
        }
        $schedule = $scheduleRepository->findAll();
        return $this->render('admin/menus.html.twig', [
            'schedule' => $schedule,
            'info' => $restaurantInfo
        ]);
    }

    #[Route('/reservations', name: 'app_admin_booking')]
    public function adminBooking(ScheduleRepository $scheduleRepository, RestaurantRepository $restaurantRepository): Response
    {
        $info = $restaurantRepository->findAll();
        if(count($info) === 0){
            $restaurantInfo = false;
        } else {
            $restaurantInfo = $info[0];
        }
        $schedule = $scheduleRepository->findAll();
        return $this->render('admin/booking.html.twig', [
            'schedule' => $schedule,
            'info' => $restaurantInfo
        ]);
    }

    #[Route('/account', name: 'app_admin_account')]
    public function adminAccount(ScheduleRepository $scheduleRepository, RestaurantRepository $restaurantRepository): Response
    {
        $info = $restaurantRepository->findAll();
        if(count($info) === 0){
            $restaurantInfo = false;
        } else {
            $restaurantInfo = $info[0];
        }
        $schedule = $scheduleRepository->findAll();
        return $this->render('admin/account.html.twig', [
            'schedule' => $schedule,
            'info' => $restaurantInfo
        ]);
    }
}
