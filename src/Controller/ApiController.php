<?php

namespace App\Controller;

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
use App\Repository\BookingRepository;
use App\Repository\CategoryRepository;
use App\Repository\DishRepository;
use App\Repository\GalleryRepository;
use App\Repository\MenuRepository;
use App\Repository\RestaurantRepository;
use App\Repository\ScheduleRepository;
use Doctrine\ORM\EntityManagerInterface;
use Error;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Serializer\Context\Normalizer\ObjectNormalizerContextBuilder;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\Validator\Constraints\File;
use Symfony\Component\Validator\Validator\ValidatorInterface;


#[Route('/api')]
class ApiController extends AbstractController
{
    ///////////////////////
    // PAGES CONTROLLERS //
    ///////////////////////

    #[Route('/gallery', name: 'app_get_gallery', methods: ['GET'])]
    public function gallery(GalleryRepository $galleryRepository, SerializerInterface $serializer): JsonResponse
    {
        $images = $galleryRepository->findAll();
        $imagesJson = $serializer->serialize($images, 'json', []);

        return new JsonResponse($imagesJson, Response::HTTP_OK, [], true);
    }

    #[Route('/category_with_dishes', name: 'app_get_category_with_formula', methods: ['GET'])]
    public function category_with_dishes(CategoryRepository $categoryRepository, SerializerInterface $serializer): JsonResponse
    {
        $categories = $categoryRepository->findOrderByRank();
        $context = (new ObjectNormalizerContextBuilder())
            ->withGroups('get_category_with_dishes')
            ->toArray();
        $categoriesJson = $serializer->serialize($categories, 'json', $context);

        return new JsonResponse($categoriesJson, Response::HTTP_OK, [], true);
    }

    #[Route('/menu_with_formulas', name: 'app_get_menu_with_formulas', methods: ['GET'])]
    public function menu_with_formula(MenuRepository $menuRepository, SerializerInterface $serializer): JsonResponse
    {
        $menus = $menuRepository->findAll();
        $context = (new ObjectNormalizerContextBuilder())
            ->withGroups('get_menu_with_formulas')
            ->toArray();
        $menusJson = $serializer->serialize($menus, 'json', $context);

        return new JsonResponse($menusJson, Response::HTTP_OK, [], true);
    }

    ///////////////////////
    // ADMIN CONTROLLERS //
    ///////////////////////

    // Gallery
    ////////////
    #[Route('/update/image/{id}', name: 'app_update_image', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits suffisants pour effectuer cette action')]
    public function update_image(
        Gallery $image,
        SerializerInterface $serializer,
        Request $request,
        EntityManagerInterface $em,
        SluggerInterface $slugger,
        ValidatorInterface $validator
    ): JsonResponse {

        $submittedToken = $request->request->get('token');

        if ($this->isCsrfTokenValid('image', $submittedToken)) {
            $updateImage = $request->files->get('image');
            $description = $request->get('description');
            $message = [];
            // Check if file is an image with a max size 2Mo
            $violations = $validator->validate(
                $updateImage,
                new File([
                    'maxSize' => '2000K',
                    'mimeTypes' => [
                        'image/*'
                    ]
                ])
            );

            if ($violations->count() > 0) {
                $message = [
                    'message' => 'Le fichier doit être une image de moins de 2Mo'
                ];

                $messageJson = $serializer->serialize($message, 'json', []);

                return new JsonResponse($messageJson, Response::HTTP_BAD_REQUEST, [], true);
            }

            if ($updateImage) {

                $originalFilename = pathinfo($updateImage->getClientOriginalName(), PATHINFO_FILENAME);
                $safeFilename = $slugger->slug($originalFilename);
                $newFilename = $safeFilename . '-' . uniqid() . '.' . $updateImage->guessExtension();
                try {
                    $updateImage->move(
                        $this->getParameter('image_directory'),
                        $newFilename
                    );

                    $filesystem = new Filesystem();

                    $oldImage = $image->getUrl();
                    $filesystem->remove([$this->getParameter('image_directory') . '/' . $oldImage]);

                    $image->setUrl($newFilename);
                } catch (FileException $e) {
                    // ... handle exception if something happens during file upload
                    $message = [
                        'message' => 'Un problème est servenu lors du chargement de l\'image, veuillez recommencer'
                    ];

                    $messageJson = $serializer->serialize($message, 'json', []);

                    return new JsonResponse($messageJson, Response::HTTP_INTERNAL_SERVER_ERROR, [], true);
                }
            }

            if ($description) {
                $image->setDescription($description);
            }

            $em->persist($image);
            $em->flush();
            $content = [
                'message' => 'Changement sauvegardé. Veuillez patienter pendant le rechargement de la page'
            ];
            $imagesJson = $serializer->serialize($content, 'json', []);
            return new JsonResponse($imagesJson, Response::HTTP_OK, [], true);
        } else {
            throw new Error("Token invalide", Response::HTTP_FORBIDDEN);
        }
    }

    #[Route('/delete/image/{id}', name: 'app_delete_image', methods: ['DELETE'])]
    #[IsGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits suffisants pour effectuer cette action')]
    public function delete_image(
        Gallery $image,
        Request $request,
        SerializerInterface $serializer,
        EntityManagerInterface $em,
    ): JsonResponse {
        $requestArray = $request->toArray();

        $submittedToken = $requestArray['token'];

        if ($this->isCsrfTokenValid('image', $submittedToken)) {
            $imageUrl = $image->getUrl();
            try {
                $filesystem = new Filesystem();

                $filesystem->remove([$this->getParameter('image_directory') . '/' . $imageUrl]);
            } catch (FileException $e) {
                // ... handle exception if something happens during file upload
                $message = [
                    'message' => 'Un problème est servenu lors de la suppression de l\'image, veuillez recommencer'
                ];

                $messageJson = $serializer->serialize($message, 'json', []);

                return new JsonResponse($messageJson, Response::HTTP_INTERNAL_SERVER_ERROR, [], true);
            }


            $em->remove($image);
            $em->flush();
            $content = [
                'message' => 'Image supprimée. Veuillez patienter pendant le rechargement de la page'
            ];
            $imagesJson = $serializer->serialize($content, 'json', []);
            return new JsonResponse($imagesJson, Response::HTTP_OK, [], true);
        } else {
            throw new Error("Token invalide", Response::HTTP_FORBIDDEN);
        }
    }

    #[Route('/add/image', name: 'app_add_image', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits suffisants pour effectuer cette action')]
    public function add_image(
        SerializerInterface $serializer,
        Request $request,
        EntityManagerInterface $em,
        SluggerInterface $slugger,
        ValidatorInterface $validator
    ): JsonResponse {

        $submittedToken = $request->request->get('token');

        if ($this->isCsrfTokenValid('image', $submittedToken)) {
            $image = new Gallery();

            $updateImage = $request->files->get('image');
            $description = $request->get('description');
            // Check if file is an image with a max size 2Mo
            $violations = $validator->validate(
                $updateImage,
                new File([
                    'maxSize' => '2000K',
                    'mimeTypes' => [
                        'image/*'
                    ]
                ])
            );

            if ($violations->count() > 0) {
                $message = [
                    'message' => 'Le fichier doit être une image de moins de 2Mo'
                ];

                $messageJson = $serializer->serialize($message, 'json', []);

                return new JsonResponse($messageJson, Response::HTTP_BAD_REQUEST, [], true);
            }

            if ($updateImage) {

                $originalFilename = pathinfo($updateImage->getClientOriginalName(), PATHINFO_FILENAME);
                $safeFilename = $slugger->slug($originalFilename);
                $newFilename = $safeFilename . '-' . uniqid() . '.' . $updateImage->guessExtension();
                try {
                    $updateImage->move(
                        $this->getParameter('image_directory'),
                        $newFilename
                    );

                    $image->setUrl($newFilename);
                } catch (FileException $e) {
                    // ... handle exception if something happens during file upload
                    $message = [
                        'message' => 'Un problème est servenu lors du chargement de l\'image, veuillez recommencer'
                    ];

                    $messageJson = $serializer->serialize($message, 'json', []);

                    return new JsonResponse($messageJson, Response::HTTP_INTERNAL_SERVER_ERROR, [], true);
                }
            } else {
                $message = [
                    'message' => 'Vous devez ajouter une image'
                ];

                $messageJson = $serializer->serialize($message, 'json', []);

                return new JsonResponse($messageJson, Response::HTTP_INTERNAL_SERVER_ERROR, [], true);
            }

            if ($description) {
                $image->setDescription($description);
            } else {
                $message = [
                    'message' => 'Vous devez ajouter une description'
                ];

                $messageJson = $serializer->serialize($message, 'json', []);

                return new JsonResponse($messageJson, Response::HTTP_INTERNAL_SERVER_ERROR, [], true);
            }

            $em->persist($image);
            $em->flush();
            $content = [
                'message' => 'Changement sauvegardé. Veuillez patienter pendant le rechargement de la page'
            ];
            $imagesJson = $serializer->serialize($content, 'json', []);
            return new JsonResponse($imagesJson, Response::HTTP_OK, [], true);
        } else {
            throw new Error("Token invalide", Response::HTTP_FORBIDDEN);
        }
    }

    // Restaurant Info
    ////////////////////
    #[Route('/restaurant', name: 'app_get_restaurant_info', methods: ['GET'])]
    public function get_restaurant(
        RestaurantRepository $restaurantRepository,
        SerializerInterface $serializer
    ): JsonResponse {
        $restaurant = $restaurantRepository->findAll();
        $context = (new ObjectNormalizerContextBuilder())
            ->withGroups('get_restaurant')
            ->toArray();
        $restaurantJson = $serializer->serialize($restaurant, 'json', $context);
        return new JsonResponse($restaurantJson, Response::HTTP_OK, [], true);
    }

    #[Route('/update/restaurant/{id}', name: 'app_update_restaurant_info', methods: ['PUT'])]
    #[IsGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits suffisants pour effectuer cette action')]
    public function update_restaurant(
        Restaurant $restaurant,
        SerializerInterface $serializer,
        Request $request,
        EntityManagerInterface $em
    ): JsonResponse {

        $requestArray = $request->toArray();

        $submittedToken = $requestArray['token'];

        if ($this->isCsrfTokenValid('restaurant', $submittedToken)) {

            $updateRestaurant = $serializer->deserialize(
                $request->getContent(),
                Restaurant::class,
                'json'
            );
            $restaurant->setAddress($updateRestaurant->getAddress());
            $restaurant->setCity($updateRestaurant->getCity());
            $restaurant->setPhone($updateRestaurant->getPhone());
            $restaurant->setPostCode($updateRestaurant->getPostCode());
            $restaurant->setMaxCapacity($updateRestaurant->getMaxCapacity());

            // TODO : intégrer les validations du formulaire, avec réponse pour les erreurs
            $em->persist($restaurant);
            $em->flush();

            return new JsonResponse($request->getContent(), Response::HTTP_OK, [], true);
        } else {
            throw new Error("Token invalide", Response::HTTP_FORBIDDEN);
        }
    }

    // Schedule
    /////////////
    #[Route('/schedule', name: 'app_get_schedule', methods: ['GET'])]
    public function get_schedule(
        ScheduleRepository $scheduleRepository,
        SerializerInterface $serializer
    ): JsonResponse {
        $schedule = $scheduleRepository->findAll();
        $scheduleJson = $serializer->serialize($schedule, 'json', []);

        return new JsonResponse($scheduleJson, Response::HTTP_OK, [], true);
    }

    #[Route('/update/schedule/{id}', name: 'app_update_schedule', methods: ['PUT'])]
    #[IsGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits suffisants pour effectuer cette action')]
    public function update_schedule(
        Schedule $schedule,
        Request $request,
        SerializerInterface $serializer,
        EntityManagerInterface $em
    ): JsonResponse {

        $requestArray = $request->toArray();

        $submittedToken = $requestArray['token'];

        if ($this->isCsrfTokenValid('schedule', $submittedToken)) {

            $updateSchedule = $serializer->deserialize(
                $request->getContent(),
                Schedule::class,
                'json'
            );
            $schedule->setNoonStart($updateSchedule->getNoonStart());
            $schedule->setNoonEnd($updateSchedule->getNoonEnd());
            $schedule->setNoonClosed($updateSchedule->isNoonClosed());
            $schedule->setEveningStart($updateSchedule->getEveningStart());
            $schedule->setEveningEnd($updateSchedule->getEveningEnd());
            $schedule->setEveningClosed($updateSchedule->isEveningClosed());

            $em->persist($schedule);
            $em->flush();
            $content = [
                "message" => "Changement sauvegardé. Veuillez patienter pendant le chargement de la page"
            ];

            $contentJson = $serializer->serialize($content, 'json', []);

            return new JsonResponse($contentJson, Response::HTTP_OK, [], true);
        } else {
            throw new Error("Token invalide", Response::HTTP_FORBIDDEN);
        }
    }

    // Category and dishes
    ////////////////////////
    #[Route('/categories', name: 'app_get_categories', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits suffisants pour effectuer cette action')]
    public function get_categories(
        CategoryRepository $categoryRepository,
        SerializerInterface $serializer,

    ): JsonResponse {
        $category = $categoryRepository->findOrderByRank();
        $context = (new ObjectNormalizerContextBuilder())
            ->withGroups('get_category')
            ->toArray();
        $categoryJson = $serializer->serialize($category, 'json', $context);
        return new JsonResponse($categoryJson, Response::HTTP_OK, [], true);
    }

    #[Route('/update/categories/{id}', name: 'app_update_categories', methods: ['PUT'])]
    #[IsGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits suffisants pour effectuer cette action')]
    public function update_categories(
        Category $category,
        Request $request,
        SerializerInterface $serializer,
        EntityManagerInterface $em
    ): JsonResponse {

        $requestArray = $request->toArray();

        $submittedToken = $requestArray['token'];

        if ($this->isCsrfTokenValid('category', $submittedToken)) {

            $updateCategory = $serializer->deserialize(
                $request->getContent(),
                Category::class,
                'json'
            );


            $category->setName($updateCategory->getName());
            $category->setRankDisplay($updateCategory->getRankDisplay());
            $em->persist($category);
            $em->flush();
            $content = [
                "message" => "Changement sauvegardé. Veuillez patienter pendant le chargement de la page"
            ];

            $contentJson = $serializer->serialize($content, 'json', []);

            return new JsonResponse($contentJson, Response::HTTP_OK, [], true);
        } else {
            throw new Error("Token invalide", Response::HTTP_FORBIDDEN);
        }
    }

    #[Route('/delete/categories/{id}', name: 'app_delete_categories', methods: ['DELETE'])]
    #[IsGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits suffisants pour effectuer cette action')]
    public function delete_categories(
        Category $category,
        Request $request,
        EntityManagerInterface $em,
        SerializerInterface $serializer
    ): JsonResponse {
        $requestArray = $request->toArray();

        $submittedToken = $requestArray['token'];

        if ($this->isCsrfTokenValid('category', $submittedToken)) {
            $em->remove($category);
            $em->flush();
            $content = [
                'message' => 'Catégorie supprimée. Veuillez patienter pendant le rechargement de la page'
            ];
            $imagesJson = $serializer->serialize($content, 'json', []);
            return new JsonResponse($imagesJson, Response::HTTP_OK, [], true);
        } else {
            throw new Error("Token invalide", Response::HTTP_FORBIDDEN);
        }
    }

    #[Route('/add/categories', name: 'app_add_categories', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits suffisants pour effectuer cette action')]
    public function add_categories(
        Request $request,
        SerializerInterface $serializer,
        EntityManagerInterface $em
    ): JsonResponse {

        $requestArray = $request->toArray();

        $submittedToken = $requestArray['token'];

        if ($this->isCsrfTokenValid('category', $submittedToken)) {
            $updateCategory = $serializer->deserialize(
                $request->getContent(),
                Category::class,
                'json'
            );

            $category = new Category();
            $category->setName($updateCategory->getName());
            $category->setRankDisplay($updateCategory->getRankDisplay());
            $em->persist($category);
            $em->flush();
            $content = [
                "message" => "Catégorie ajoutée. Veuillez patienter pendant le chargement de la page"
            ];

            $contentJson = $serializer->serialize($content, 'json', []);

            return new JsonResponse($contentJson, Response::HTTP_OK, [], true);
        } else {
            throw new Error("Token invalide", Response::HTTP_FORBIDDEN);
        }
    }

    #[Route('/dishes', name: 'app_get_dishes', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits suffisants pour effectuer cette action')]
    public function get_dishes(
        DishRepository $dishRepository,
        SerializerInterface $serializer,

    ): JsonResponse {
        $dish = $dishRepository->findAll();
        $context = (new ObjectNormalizerContextBuilder())
            ->withGroups('get_dishes')
            ->toArray();
        $dishJson = $serializer->serialize($dish, 'json', $context);
        return new JsonResponse($dishJson, Response::HTTP_OK, [], true);
    }

    #[Route('/update/dishes/{id}', name: 'app_update_dishes', methods: ['PUT'])]
    #[IsGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits suffisants pour effectuer cette action')]
    public function update_dishes(
        Dish $dish,
        CategoryRepository $categoryRepository,
        Request $request,
        SerializerInterface $serializer,
        EntityManagerInterface $em
    ): JsonResponse {
        $requestArray = $request->toArray();

        $submittedToken = $requestArray['token'];

        if ($this->isCsrfTokenValid('dishes', $submittedToken)) {
            $updateDish = $serializer->deserialize(
                $request->getContent(),
                Dish::class,
                'json'
            );

            $dish->setName($updateDish->getName());
            $dish->setDescription($updateDish->getDescription());
            $dish->setPrice($updateDish->getPrice());


            $content = $request->toArray();
            $idCategory = $content['category'];

            $dish->setCategory($categoryRepository->find($idCategory));
            $em->persist($dish);
            $em->flush();

            $content = [
                "message" => "Changement sauvegardé. Veuillez patienter pendant le chargement de la page"
            ];

            $contentJson = $serializer->serialize($content, 'json', []);

            return new JsonResponse($contentJson, Response::HTTP_OK, [], true);
        } else {
            throw new Error("Token invalide", Response::HTTP_FORBIDDEN);
        }
    }

    #[Route('/add/dishes', name: 'app_add_dishes', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits suffisants pour effectuer cette action')]
    public function add_dishes(
        CategoryRepository $categoryRepository,
        Request $request,
        SerializerInterface $serializer,
        EntityManagerInterface $em
    ): JsonResponse {
        $requestArray = $request->toArray();

        $submittedToken = $requestArray['token'];

        if ($this->isCsrfTokenValid('dishes', $submittedToken)) {
            $updateDish = $serializer->deserialize(
                $request->getContent(),
                Dish::class,
                'json'
            );

            $dish = new Dish();

            $dish->setName($updateDish->getName());
            $dish->setDescription($updateDish->getDescription());
            $dish->setPrice($updateDish->getPrice());


            $content = $request->toArray();
            $idCategory = $content['category'];

            $dish->setCategory($categoryRepository->find($idCategory));
            $em->persist($dish);
            $em->flush();

            $content = [
                "message" => "Changement sauvegardé. Veuillez patienter pendant le chargement de la page"
            ];

            $contentJson = $serializer->serialize($content, 'json', []);

            return new JsonResponse($contentJson, Response::HTTP_OK, [], true);
        } else {
            throw new Error("Token invalide", Response::HTTP_FORBIDDEN);
        }
    }

    #[Route('/delete/dishes/{id}', name: 'app_delete_dishes', methods: ['DELETE'])]
    #[IsGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits suffisants pour effectuer cette action')]
    public function delete_dishes(
        Dish $dish,
        Request $request,
        EntityManagerInterface $em,
        SerializerInterface $serializer
    ): JsonResponse {
        $requestArray = $request->toArray();

        $submittedToken = $requestArray['token'];

        if ($this->isCsrfTokenValid('dishes', $submittedToken)) {
            $em->remove($dish);
            $em->flush();
            $content = [
                'message' => 'Catégorie supprimée. Veuillez patienter pendant le rechargement de la page'
            ];
            $imagesJson = $serializer->serialize($content, 'json', []);
            return new JsonResponse($imagesJson, Response::HTTP_OK, [], true);
        } else {
            throw new Error("Token invalide", Response::HTTP_FORBIDDEN);
        }
    }


    // Menus and Formulas
    ///////////////////////
    #[Route('/menus', name: 'app_get_menus', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits suffisants pour effectuer cette action')]
    public function get_menus(
        MenuRepository $menuRepository,
        SerializerInterface $serializer,

    ): JsonResponse {
        $menu = $menuRepository->findAll();
        $context = (new ObjectNormalizerContextBuilder())
            ->withGroups('get_menu_with_formulas')
            ->toArray();
        $menuJson = $serializer->serialize($menu, 'json', $context);
        return new JsonResponse($menuJson, Response::HTTP_OK, [], true);
    }

    #[Route('/update/menus/{id}', name: 'app_update_menus', methods: ['PUT'])]
    #[IsGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits suffisants pour effectuer cette action')]
    public function update_menus(
        Menu $menu,
        Request $request,
        SerializerInterface $serializer,
        EntityManagerInterface $em
    ): JsonResponse {

        $requestArray = $request->toArray();

        $submittedToken = $requestArray['token'];

        if ($this->isCsrfTokenValid('menus', $submittedToken)) {
            $updateMenu = $serializer->deserialize(
                $request->getContent(),
                Category::class,
                'json'
            );


            $menu->setName($updateMenu->getName());
            $em->persist($menu);
            $em->flush();
            $content = [
                "message" => "Changement sauvegardé. Veuillez patienter pendant le chargement de la page"
            ];

            $contentJson = $serializer->serialize($content, 'json', []);

            return new JsonResponse($contentJson, Response::HTTP_OK, [], true);
        } else {
            throw new Error("Token invalide", Response::HTTP_FORBIDDEN);
        }
    }

    #[Route('/delete/menus/{id}', name: 'app_delete_menus', methods: ['DELETE'])]
    #[IsGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits suffisants pour effectuer cette action')]
    public function delete_menus(
        Menu $menu,
        Request $request,
        EntityManagerInterface $em,
        SerializerInterface $serializer
    ): JsonResponse {
        $requestArray = $request->toArray();

        $submittedToken = $requestArray['token'];

        if ($this->isCsrfTokenValid('menus', $submittedToken)) {
            $em->remove($menu);
            $em->flush();
            $content = [
                'message' => 'Catégorie supprimée. Veuillez patienter pendant le rechargement de la page'
            ];
            $imagesJson = $serializer->serialize($content, 'json', []);
            return new JsonResponse($imagesJson, Response::HTTP_OK, [], true);
        } else {
            throw new Error("Token invalide", Response::HTTP_FORBIDDEN);
        }
    }

    #[Route('/add/menus', name: 'app_add_menus', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits suffisants pour effectuer cette action')]
    public function add_menus(
        Request $request,
        SerializerInterface $serializer,
        EntityManagerInterface $em
    ): JsonResponse {
        $requestArray = $request->toArray();

        $submittedToken = $requestArray['token'];

        if ($this->isCsrfTokenValid('menus', $submittedToken)) {
            $updateMenu = $serializer->deserialize(
                $request->getContent(),
                Menu::class,
                'json'
            );

            $menu = new Menu();
            $menu->setName($updateMenu->getName());
            $em->persist($menu);
            $em->flush();
            $content = [
                "message" => "Catégorie ajoutée. Veuillez patienter pendant le chargement de la page"
            ];

            $contentJson = $serializer->serialize($content, 'json', []);

            return new JsonResponse($contentJson, Response::HTTP_OK, [], true);
        } else {
            throw new Error("Token invalide", Response::HTTP_FORBIDDEN);
        }
    }


    #[Route('/update/formulas/{id}', name: 'app_update_formulas', methods: ['PUT'])]
    #[IsGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits suffisants pour effectuer cette action')]
    public function update_formulas(
        Formula $formula,
        Request $request,
        SerializerInterface $serializer,
        EntityManagerInterface $em
    ): JsonResponse {
        $requestArray = $request->toArray();

        $submittedToken = $requestArray['token'];

        if ($this->isCsrfTokenValid('formulas', $submittedToken)) {
            $updateFormula = $serializer->deserialize(
                $request->getContent(),
                Formula::class,
                'json'
            );

            $formula->setName($updateFormula->getName());
            $formula->setDescription($updateFormula->getDescription());
            $formula->setPrice($updateFormula->getPrice());

            $em->persist($formula);
            $em->flush();

            $content = [
                "message" => "Changement sauvegardé. Veuillez patienter pendant le chargement de la page"
            ];

            $contentJson = $serializer->serialize($content, 'json', []);

            return new JsonResponse($contentJson, Response::HTTP_OK, [], true);
        } else {
            throw new Error("Token invalide", Response::HTTP_FORBIDDEN);
        }
    }

    #[Route('/add/formulas', name: 'app_add_formulas', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits suffisants pour effectuer cette action')]
    public function add_formulas(
        MenuRepository $menuRepository,
        Request $request,
        SerializerInterface $serializer,
        EntityManagerInterface $em
    ): JsonResponse {
        $requestArray = $request->toArray();

        $submittedToken = $requestArray['token'];

        if ($this->isCsrfTokenValid('formulas', $submittedToken)) {
            $updateFormula = $serializer->deserialize(
                $request->getContent(),
                Formula::class,
                'json'
            );

            $formula = new Formula();

            $formula->setName($updateFormula->getName());
            $formula->setDescription($updateFormula->getDescription());
            $formula->setPrice($updateFormula->getPrice());


            $requestArray = $request->toArray();
            $idMenu = $requestArray['menuId'];

            $formula->setMenu($menuRepository->find($idMenu));
            $em->persist($formula);
            $em->flush();

            $content = [
                "message" => "Changement sauvegardé. Veuillez patienter pendant le chargement de la page"
            ];

            $contentJson = $serializer->serialize($content, 'json', []);

            return new JsonResponse($contentJson, Response::HTTP_OK, [], true);
        } else {
            throw new Error("Token invalide", Response::HTTP_FORBIDDEN);
        }
    }

    #[Route('/delete/formulas/{id}', name: 'app_delete_formulas', methods: ['DELETE'])]
    #[IsGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits suffisants pour effectuer cette action')]
    public function delete_formulas(
        Formula $formula,
        Request $request,
        EntityManagerInterface $em,
        SerializerInterface $serializer
    ): JsonResponse {
        $requestArray = $request->toArray();

        $submittedToken = $requestArray['token'];

        if ($this->isCsrfTokenValid('formulas', $submittedToken)) {
            $em->remove($formula);
            $em->flush();
            $content = [
                'message' => 'Catégorie supprimée. Veuillez patienter pendant le rechargement de la page'
            ];
            $imagesJson = $serializer->serialize($content, 'json', []);
            return new JsonResponse($imagesJson, Response::HTTP_OK, [], true);
        } else {
            throw new Error("Token invalide", Response::HTTP_FORBIDDEN);
        }
    }

    // Booking
    ////////////
    #[Route('/booking', name: 'app_get_booking', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits suffisants pour effectuer cette action')]
    public function get_booking(
        BookingRepository $bookingRepository,
        SerializerInterface $serializer,

    ): JsonResponse {
        $booking = $bookingRepository->findOrderByDate();

        $bookingJson = $serializer->serialize($booking, 'json', []);
        return new JsonResponse($bookingJson, Response::HTTP_OK, [], true);
    }

    #[Route('/update/booking/{id}', name: 'app_update_booking', methods: ['PUT'])]
    #[IsGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits suffisants pour effectuer cette action')]
    public function update_booking(
        Booking $booking,
        Request $request,
        SerializerInterface $serializer,
        EntityManagerInterface $em
    ): JsonResponse {
        $requestArray = $request->toArray();

        $submittedToken = $requestArray['token'];

        if ($this->isCsrfTokenValid('booking', $submittedToken)) {
            $updateBooking = $serializer->deserialize(
                $request->getContent(),
                Booking::class,
                'json'
            );

            $booking->setLastName($updateBooking->getLastName());
            $booking->setAllergies($updateBooking->getAllergies());
            $booking->setPhone($updateBooking->getPhone());
            $booking->setShift($updateBooking->getShift());
            $booking->setDate($updateBooking->getDate());
            $booking->setTime($updateBooking->getTime());
            $booking->setNumber($updateBooking->getNumber());

            $em->persist($booking);
            $em->flush();

            $content = [
                "message" => "Changement sauvegardé. Veuillez patienter pendant le chargement de la page"
            ];

            $contentJson = $serializer->serialize($content, 'json', []);

            return new JsonResponse($contentJson, Response::HTTP_OK, [], true);
        } else {
            throw new Error("Token invalide", Response::HTTP_FORBIDDEN);
        }
    }

    #[Route('/add/booking', name: 'app_add_booking', methods: ['PUT'])]
    public function add_booking(
        Request $request,
        SerializerInterface $serializer,
        EntityManagerInterface $em
    ): JsonResponse {
        $requestArray = $request->toArray();

        $submittedToken = $requestArray['token'];

        if ($this->isCsrfTokenValid('booking', $submittedToken)) {
            $updateBooking = $serializer->deserialize(
                $request->getContent(),
                Booking::class,
                'json'
            );

            $booking = new Booking();
            $booking->setLastName($updateBooking->getLastName());
            $booking->setAllergies($updateBooking->getAllergies());
            $booking->setPhone($updateBooking->getPhone());
            $booking->setShift($updateBooking->getShift());
            $booking->setDate($updateBooking->getDate());
            $booking->setTime($updateBooking->getTime());
            $booking->setNumber($updateBooking->getNumber());

            $em->persist($booking);
            $em->flush();

            $content = [
                "message" => "Changement sauvegardé. Veuillez patienter pendant le chargement de la page"
            ];

            $contentJson = $serializer->serialize($content, 'json', []);

            return new JsonResponse($contentJson, Response::HTTP_OK, [], true);
        } else {
            throw new Error("Token invalide", Response::HTTP_FORBIDDEN);
        }
    }

    #[Route('/delete/booking/{id}', name: 'app_delete_booking', methods: ['DELETE'])]
    #[IsGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits suffisants pour effectuer cette action')]
    public function delete_booking(
        Booking $booking,
        Request $request,
        EntityManagerInterface $em,
        SerializerInterface $serializer
    ): JsonResponse {
        $requestArray = $request->toArray();

        $submittedToken = $requestArray['token'];

        if ($this->isCsrfTokenValid('booking', $submittedToken)) {
            $em->remove($booking);
            $em->flush();
            $content = [
                'message' => 'Réservation supprimée. Veuillez patienter pendant le rechargement de la page'
            ];
            $imagesJson = $serializer->serialize($content, 'json', []);
            return new JsonResponse($imagesJson, Response::HTTP_OK, [], true);
        } else {
            throw new Error("Token invalide", Response::HTTP_FORBIDDEN);
        }
    }


    // Route to get the remaining available seats and the schedule depending on the day
    #[Route('/booking/getavailable', name: 'app_booking_available', methods: ['GET'])]
    public function get_booking_available(
        BookingRepository $bookingRepository,
        RestaurantRepository $restaurantRepository,
        ScheduleRepository $scheduleRepository,
        Request $request,
        SerializerInterface $serializer
    ): JsonResponse {

        $date = $request->query->get('date');
        $shift = $request->query->get('shift');

        $day = $scheduleRepository->getScheduleByDate($date, $shift);

        $maxCapacity = $restaurantRepository->getMaxCapacity();

        $seatsTaken = $bookingRepository->getAvailable($date, $shift)[0]['seats'] === null ? 0 : intval($bookingRepository->getAvailable($date, $shift)[0]['seats']);

        $seatsLeft = $maxCapacity - $seatsTaken;
        $response = [
            'seatsLeft' => $seatsLeft,
            'shiftStart' => $day['start'],
            'shiftEnd' => $day['end'],
            'shiftClosed' => $day['closed']

        ];

        $responseJson = $serializer->serialize($response, 'json', []);
        return new JsonResponse($responseJson, Response::HTTP_OK, [], true);
    }

    // Client Account and Profil
    ///////////////////////////
    #[Route('/get/client/{id}', name: 'app_get_client', methods: ['GET'])]
    #[IsGranted('ROLE_USER', message: 'Vous n\'avez pas les droits suffisants pour effectuer cette action')]
    public function get_client(
        User $user,
        SerializerInterface $serializer
    ): JsonResponse {

        $email = $user->getEmail();

        $response = [
            'email' => $email
        ];

        $responseJson = $serializer->serialize($response, 'json', []);

        return new JsonResponse($responseJson, Response::HTTP_OK, [], true);
    }

    #[Route('/update/client/{id}', name: 'app_update_client', methods: ['PUT'])]
    #[IsGranted('ROLE_USER', message: 'Vous n\'avez pas les droits suffisants pour effectuer cette action')]
    public function update_client(
        User $user,
        Request $request,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $userPasswordHasher,
        SerializerInterface $serializer,
        Security $security
    ): JsonResponse {
        $requestArray = $request->toArray();

        $submittedToken = $requestArray['token'];

        if ($this->isCsrfTokenValid('profil', $submittedToken)) {
            $currentUser = $security->getUser();
            $requestArray = $request->toArray();
            $email = $requestArray['email'];
            $newPassword = $requestArray['password'];
            $verifPwd = $requestArray['verifPwd'];

            // Verify if the current user is trying to make update on his account
            if ($currentUser !== $user) {
                $content = [
                    'message' => 'Vous ne pouvez effectuer de modification uniquement sur votre compte'
                ];
                $responseJson = $serializer->serialize($content, 'json', []);

                return new JsonResponse($responseJson, Response::HTTP_FORBIDDEN, [], true);
            }

            // If the current password is Okay
            if ($userPasswordHasher->isPasswordValid($user, $verifPwd)) {

                if ($email) {
                    $user->setEmail($email);
                }

                if ($newPassword) {
                    $user->setPassword(
                        $userPasswordHasher->hashPassword(
                            $user,
                            $newPassword
                        )
                    );
                }

                $em->persist($user);
                $em->flush();

                $content = [
                    'message' => "Changements effectués"

                ];
                $responseJson = $serializer->serialize($content, 'json', []);

                return new JsonResponse($responseJson, Response::HTTP_OK, [], true);
            } else {
                $content = [
                    'message' => 'Veuillez entrer votre ancien mot de passe pour valider les changements'

                ];
                $responseJson = $serializer->serialize($content, 'json', []);

                return new JsonResponse($responseJson, Response::HTTP_FORBIDDEN, [], true);
            }
        } else {
            throw new Error("Token invalide", Response::HTTP_FORBIDDEN);
        }
    }

    #[Route('/delete/client/{id}', name: 'app_delete_client', methods: ['DELETE'])]
    #[IsGranted('ROLE_USER', message: 'Vous n\'avez pas les droits suffisants pour effectuer cette action')]
    public function delete_client(
        User $user,
        Request $request,
        UserPasswordHasherInterface $userPasswordHasher,
        EntityManagerInterface $em,
        SerializerInterface $serializer,
        Security $security
    ): JsonResponse {


        $requestArray = $request->toArray();
        $password = $requestArray['password'];
        $currentUser = $security->getUser();
        $isAdmin = in_array('ROLE_ADMIN', $user->getRoles());
        $submittedToken = $requestArray['token'];

        if ($this->isCsrfTokenValid('profil', $submittedToken)) {
            
            if ($isAdmin) {
                $content = [
                    'message' => 'Le compte administrateur ne peut pas être supprimé'
                ];
                $responseJson = $serializer->serialize($content, 'json', []);

                return new JsonResponse($responseJson, Response::HTTP_FORBIDDEN, [], true);
            }
            // Verify if the current user is trying to delete his own account
            if ($currentUser !== $user) {
                $content = [
                    'message' => 'Vous ne pouvez effectuer de modification uniquement sur votre compte'
                ];
                $responseJson = $serializer->serialize($content, 'json', []);

                return new JsonResponse($responseJson, Response::HTTP_FORBIDDEN, [], true);
            }

            if ($userPasswordHasher->isPasswordValid($user, $password)) {
                $em->remove($user);
                $em->flush();
                
                $security->logout(false);
                $content = [
                    'message' => "Client supprimé"

                ];
                $responseJson = $serializer->serialize($content, 'json', []);

                return new JsonResponse($responseJson, Response::HTTP_OK, [], true);
            } else {
                $content = [
                    'message' => 'Veuillez entrer votre ancien mot de passe pour valider la suppression'

                ];
                $responseJson = $serializer->serialize($content, 'json', []);

                return new JsonResponse($responseJson, Response::HTTP_FORBIDDEN, [], true);
            }
        } else {
            throw new Error("Token invalide", Response::HTTP_FORBIDDEN);
        }
    }

    #[Route('/update/profil/{id}', name: 'app_update_profil', methods: ['PUT'])]
    #[IsGranted('ROLE_USER', message: 'Vous n\'avez pas les droits suffisants pour effectuer cette action')]
    public function update_profil(
        Client $client,
        Request $request,
        SerializerInterface $serializer,
        EntityManagerInterface $em,
        Security $security
    ): JsonResponse {
        $requestArray = $request->toArray();

        $submittedToken = $requestArray['token'];

        if ($this->isCsrfTokenValid('profil', $submittedToken)) {
            $updateClient = $serializer->deserialize(
                $request->getContent(),
                Client::class,
                'json'
            );

            $user = $client->getUserId();
            $currentUser = $security->getUser();

            if ($currentUser !== $user) {
                $content = [
                    'message' => 'Vous ne pouvez effectuer de modification uniquement sur votre compte'
                ];
                $responseJson = $serializer->serialize($content, 'json', []);

                return new JsonResponse($responseJson, Response::HTTP_FORBIDDEN, [], true);
            }

            $client->setLastname($updateClient->getLastname());
            $client->setFirstname($updateClient->getFirstname());
            $client->setAllergies($updateClient->getAllergies());
            $client->setPhone($updateClient->getPhone());
            $client->setNumber($updateClient->getNumber());

            $em->persist($client);
            $em->flush();

            $content = [
                "message" => "Changement sauvegardé. Veuillez patienter pendant le chargement de la page"
            ];

            $contentJson = $serializer->serialize($content, 'json', []);

            return new JsonResponse($contentJson, Response::HTTP_OK, [], true);
        } else {
            throw new Error("Token invalide", Response::HTTP_FORBIDDEN);
        }
    }
}
