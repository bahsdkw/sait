// Практическая работа №1 «Отладка программы»
// Вариант 27. В массиве записана информация о стоимости 30 видов товара.
// Определить стоимость двух самых дорогих видов товара.
// Выполнил: Шевырин Александр, группа ПКС-33

using System;

namespace Variant27
{
    // Вид товара: название и стоимость
    class Product
    {
        public string Name { get; }
        public decimal Price { get; }

        public Product(string name, decimal price)
        {
            Name = name;
            Price = price;
        }

        public override string ToString() => $"{Name} — {Price:F2} руб.";
    }

    class Program
    {
        const int ProductCount = 30;

        static void Main(string[] args)
        {
            // Режим работы задаётся аргументом командной строки:
            //    --manual — ввод цен с клавиатуры;
            //    число    — зерно генератора случайных цен (по умолчанию 27).
            bool manual = args.Length > 0 && args[0] == "--manual";
            int seed = 27;
            if (!manual && args.Length > 0 && !int.TryParse(args[0], out seed))
                seed = 27;

            Product[] products = manual ? ReadProducts() : GenerateProducts(seed);

            PrintProducts(products);

            FindTwoMostExpensive(products, out int first, out int second);

            Console.WriteLine();
            Console.WriteLine("Самый дорогой товар:        " + products[first]);
            Console.WriteLine("Второй по стоимости товар: " + products[second]);
            Console.WriteLine($"Стоимость двух самых дорогих видов товара: " +
                               $"{products[first].Price:F2} и {products[second].Price:F2} руб.");
        }

        // Заполнение массива случайными ценами от 100 до 50 000 руб.
        static Product[] GenerateProducts(int seed)
        {
            var random = new Random(seed);
            var products = new Product[ProductCount];
            for (int i = 0; i < products.Length; i++)
            {
                decimal price = random.Next(10000, 5000001) / 100m;
                products[i] = new Product($"Товар {i + 1}", price);
            }
            return products;
        }

        // Ввод цен с клавиатуры с проверкой корректности
        static Product[] ReadProducts()
        {
            var products = new Product[ProductCount];
            for (int i = 0; i < products.Length; i++)
            {
                decimal price;
                Console.Write($"Стоимость товара {i + 1}: ");
                while (!decimal.TryParse(Console.ReadLine(), out price) || price < 0)
                    Console.Write("Ошибка ввода, введите неотрицательное число: ");
                products[i] = new Product($"Товар {i + 1}", price);
            }
            return products;
        }

        static void PrintProducts(Product[] products)
        {
            Console.WriteLine($"Стоимость {products.Length} видов товара:");
            for (int i = 0; i < products.Length; i++)
                Console.WriteLine($"{i + 1,3}. {products[i].Price,10:F2}");
        }

        // Поиск индексов двух самых дорогих товаров за один проход массива
        static void FindTwoMostExpensive(Product[] products, out int first, out int second)
        {
            if (products.Length < 2)
                throw new ArgumentException("В массиве должно быть не менее двух товаров");

            first = 0;
            second = -1;
            for (int i = 1; i < products.Length; i++)
            {
                decimal price = products[i].Price;
                if (price > products[first].Price)
                {
                    second = first;
                    first = i;
                }
                else if (second == -1 || price > products[second].Price)
                {
                    second = i;
                }
            }
        }
    }
}
