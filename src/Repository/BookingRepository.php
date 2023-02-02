<?php

namespace App\Repository;

use App\Entity\Booking;
use App\Entity\Schedule;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Query\Parameter;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Booking>
 *
 * @method Booking|null find($id, $lockMode = null, $lockVersion = null)
 * @method Booking|null findOneBy(array $criteria, array $orderBy = null)
 * @method Booking[]    findAll()
 * @method Booking[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 * 
 */
class BookingRepository extends ServiceEntityRepository
{


    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Booking::class);
    }

    public function save(Booking $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Booking $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function findOrderByDate(): array
    {
        return $this->createQueryBuilder('b')
            ->addOrderBy('b.date', 'ASC')
            ->addOrderBy('b.time', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function getAvailable(string $date, string $shift): array
    {
        $qb = $this->createQueryBuilder('r')
            ->andWhere('r.date = :date')
            ->andWhere('r.shift = :shift')
            ->select('SUM(r.number) as seats')
            ->setParameters(new ArrayCollection([
                new Parameter('date', $date),
                new Parameter('shift', $shift)
            ]));

        return $qb->getQuery()->getResult();
    }

    public function findWithPagination(int $page, int $maxResult): array
    {
        
        $firstResult = $page * $maxResult;
        return $this->createQueryBuilder('b')
            ->addOrderBy('b.date', 'ASC')
            ->addOrderBy('b.time', 'ASC')
            ->setFirstResult($firstResult)
            ->setMaxResults($maxResult)
            ->getQuery()
            ->getResult();
    }

    //    /**
    //     * @return Booking[] Returns an array of Booking objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('b')
    //            ->andWhere('b.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('b.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Booking
    //    {
    //        return $this->createQueryBuilder('b')
    //            ->andWhere('b.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
