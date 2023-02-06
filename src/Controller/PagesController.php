<?php

namespace App\Controller;

use App\Repository\CategoryRepository;
use App\Repository\GalleryRepository;
use App\Repository\MenuRepository;
use App\Repository\RestaurantRepository;
use App\Repository\ScheduleRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class PagesController extends AbstractController
{
    #[Route('/', name: 'app_index')]
    public function index(ScheduleRepository $scheduleRepository, RestaurantRepository $restaurantRepository, GalleryRepository $galleryRepository): Response
    {
        $gallery = $galleryRepository->findAll();

        $info = $restaurantRepository->findAll();
        $schedule = $scheduleRepository->findAll();
        return $this->render('pages/index.html.twig',[
            'schedule' => $schedule,
            'info' => $info[0],
            'gallery' => $gallery
        ]);
    }

    #[Route('/carte', name: 'app_dishes')]
    public function dishes(ScheduleRepository $scheduleRepository, RestaurantRepository $restaurantRepository, CategoryRepository $categoryRepository): Response
    {
        $category = $categoryRepository->findAll();
        $info = $restaurantRepository->findAll();
        $schedule = $scheduleRepository->findAll();
        return $this->render('pages/dishes.html.twig',[
            'schedule' => $schedule,
            'info' => $info[0],
            'categories' => $category
        ]);
    }

    #[Route('/menus', name: 'app_menus')]
    public function menus(ScheduleRepository $scheduleRepository, RestaurantRepository $restaurantRepository, MenuRepository $menuRepository): Response
    {
        $menus = $menuRepository->findAll();
        $info = $restaurantRepository->findAll();
        $schedule = $scheduleRepository->findAll();
        return $this->render('pages/menus.html.twig',[
            'schedule' => $schedule,
            'info' => $info[0],
            'menus' => $menus
        ]);
    }

    #[Route('/reservation', name: 'app_booking')]
    public function booking(ScheduleRepository $scheduleRepository, RestaurantRepository $restaurantRepository): Response
    {
        $info = $restaurantRepository->findAll();
        $schedule = $scheduleRepository->findAll();
        return $this->render('pages/booking.html.twig',[
            'schedule' => $schedule,
            'info' => $info[0]
        ]);
    }

}
