#include <stdio.h>
#include <stdlib.h>

/* Задача 4. Циклический двусвязный список */
typedef struct Node {
    int data;
    struct Node *prev, *next;
} Node;

typedef struct {
    Node *head;     /* head->prev == tail */
    int size;
} List;

void create(List *l) { l->head = NULL; l->size = 0; }

int add(List *l, int value)         /* добавление в конец */
{
    Node *n = (Node *)malloc(sizeof(Node));
    if (n == NULL) return 0;
    n->data = value;
    if (l->head == NULL) {
        n->next = n->prev = n;
        l->head = n;
    } else {
        Node *tail = l->head->prev;
        n->next = l->head;
        n->prev = tail;
        tail->next = n;
        l->head->prev = n;
    }
    l->size++;
    return 1;
}

int remove_middle(List *l, int pos) /* pos = 2..size-1 */
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

void print(const List *l)
{
    if (l->head == NULL) { printf("Список пуст\n"); return; }
    Node *p = l->head;
    do {
        printf("%d <-> ", p->data);
        p = p->next;
    } while (p != l->head);
    printf("(к началу: %d)\n", l->head->data);
}

void destroy(List *l)
{
    for (int i = 0; i < l->size; i++) {
        Node *t = l->head;
        l->head = t->next;
        free(t);
    }
    l->head = NULL;
    l->size = 0;
}

int main(void)
{
    List l;
    create(&l);
    for (int i = 1; i <= 6; i++) add(&l, i * 10);
    printf("Исходный список:\n");
    print(&l);
    remove_middle(&l, 3);
    printf("После удаления 3-го элемента:\n");
    print(&l);
    printf("Попытка удалить первый: %s\n", remove_middle(&l, 1) ? "удалён" : "отказ");
    printf("Попытка удалить последний: %s\n", remove_middle(&l, l.size) ? "удалён" : "отказ");
    destroy(&l);
    return 0;
}
