<?php

namespace App\Controller;

use App\Repository\ScheduleRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/admin')]
class AdminController extends AbstractController
{
    #[Route('/restaurant', name: 'app_admin_restaurant')]
    public function index(ScheduleRepository $scheduleRepository): Response
    {
        $schedule = $scheduleRepository->findAll();
        return $this->render('admin/restaurant.html.twig', [
            'schedule' => $schedule
        ]);
    }

    #[Route('/lacarte', name: 'app_admin_dishes')]
    public function dishes(ScheduleRepository $scheduleRepository): Response
    {
        $schedule = $scheduleRepository->findAll();
        return $this->render('admin/dishes.html.twig', [
            'schedule' => $schedule
        ]);
    }

    #[Route('/lesmenus', name: 'app_admin_menus')]
    public function menus(ScheduleRepository $scheduleRepository): Response
    {
        $schedule = $scheduleRepository->findAll();
        return $this->render('admin/menus.html.twig', [
            'schedule' => $schedule
        ]);
    }

    #[Route('/reservations', name: 'app_admin_booking')]
    public function adminBooking(ScheduleRepository $scheduleRepository): Response
    {
        $schedule = $scheduleRepository->findAll();
        return $this->render('admin/booking.html.twig', [
            'schedule' => $schedule
        ]);
    }
}
