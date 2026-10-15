#include <stdio.h>
#include <stdlib.h>

/* Задача 3. Двусвязный список, удаление из начала, вывод в обе стороны */
typedef struct Node {
    int data;
    struct Node *prev, *next;
} Node;

typedef struct {
    Node *head, *tail;
    int size;
} List;

void create(List *l) { l->head = l->tail = NULL; l->size = 0; }

int add(List *l, int value)         /* добавление в конец */
{
    Node *n = (Node *)malloc(sizeof(Node));
    if (n == NULL) return 0;
    n->data = value;
    n->next = NULL;
    n->prev = l->tail;
    if (l->tail) l->tail->next = n; else l->head = n;
    l->tail = n;
    l->size++;
    return 1;
}

int remove_first(List *l)           /* удаление из начала */
{
    if (l->head == NULL) return 0;
    Node *del = l->head;
    l->head = del->next;
    if (l->head) l->head->prev = NULL; else l->tail = NULL;
    free(del);
    l->size--;
    return 1;
}

int remove_middle(List *l, int pos) /* удаление из середины, pos = 2..size-1 */
{
    if (pos < 2 || pos > l->size - 1) return 0;
    Node *p = l->head;
    for (int i = 1; i < pos; i++) p = p->next;
    p->prev->next = p->next;
    p->next->prev = p->prev;
    free(p);
    l->size--;
    return 1;
}

void print_forward(const List *l)
{
    if (l->head == NULL) { printf("Список пуст\n"); return; }
    for (Node *p = l->head; p; p = p->next)
        printf("%d%s", p->data, p->next ? " <-> " : "\n");
}

void print_backward(const List *l)
{
    if (l->tail == NULL) { printf("Список пуст\n"); return; }
    for (Node *p = l->tail; p; p = p->prev)
        printf("%d%s", p->data, p->prev ? " <-> " : "\n");
}

void destroy(List *l) { while (remove_first(l)); }

int main(void)
{
    List l;
    create(&l);
    for (int i = 1; i <= 5; i++) add(&l, i * 10);
    printf("Исходный список (из начала в конец):\n");
    print_forward(&l);
    printf("Исходный список (из конца в начало):\n");
    print_backward(&l);
    remove_first(&l);
    printf("После удаления из начала:\n");
    print_forward(&l);
    remove_middle(&l, 2);
    printf("После удаления из середины (2-й элемент):\n");
    print_forward(&l);
    printf("Из конца в начало:\n");
    print_backward(&l);
    destroy(&l);
    return 0;
}
