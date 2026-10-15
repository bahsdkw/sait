#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/* Статическая структура Book (три поля) */
typedef struct {
    char title[50];
    char author[50];
    int year;
} Book;

/* Динамическая структура: содержит указатель на Book и на следующий узел */
typedef struct Node {
    Book *book;
    struct Node *next;
} Node;

Node *create_node(const char *title, const char *author, int year)
{
    Node *n = (Node *)malloc(sizeof(Node));
    if (n == NULL) return NULL;
    n->book = (Book *)malloc(sizeof(Book));
    if (n->book == NULL) { free(n); return NULL; }
    strncpy(n->book->title, title, sizeof(n->book->title) - 1);
    n->book->title[sizeof(n->book->title) - 1] = '\0';
    strncpy(n->book->author, author, sizeof(n->book->author) - 1);
    n->book->author[sizeof(n->book->author) - 1] = '\0';
    n->book->year = year;
    n->next = NULL;
    return n;
}

int main(void)
{
    Node *first = create_node("Война и мир", "Л. Н. Толстой", 1869);
    Node *second = create_node("Мастер и Маргарита", "М. А. Булгаков", 1967);
    if (first == NULL || second == NULL) {
        printf("Ошибка выделения памяти\n");
        return 1;
    }
    first->next = second;           /* связываем структуры между собой */

    /* вывод информации из обеих структур только через первую */
    int i = 1;
    for (Node *p = first; p != NULL; p = p->next, i++)
        printf("Книга %d: \"%s\", %s, %d г.\n", i, p->book->title,
               p->book->author, p->book->year);

    /* освобождение памяти */
    free(first->next->book);
    free(first->next);
    free(first->book);
    free(first);
    return 0;
}
