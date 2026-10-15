#include <stdio.h>
#include <stdlib.h>

/* Задача 5. Циклический односвязный список */
typedef struct Node {
    int data;
    struct Node *next;
} Node;

typedef struct {
    Node *tail;     /* tail->next == head */
    int size;
} List;

void create(List *l) { l->tail = NULL; l->size = 0; }

int add(List *l, int value)         /* добавление в конец */
{
    Node *n = (Node *)malloc(sizeof(Node));
    if (n == NULL) return 0;
    n->data = value;
    if (l->tail == NULL) {
        n->next = n;
    } else {
        n->next = l->tail->next;
        l->tail->next = n;
    }
    l->tail = n;
    l->size++;
    return 1;
}

int remove_middle(List *l, int pos) /* pos = 2..size-1 */
{
    if (pos < 2 || pos > l->size - 1) return 0;
    Node *prev = l->tail->next;     /* голова */
    for (int i = 1; i < pos - 1; i++) prev = prev->next;
    Node *del = prev->next;
    prev->next = del->next;
    free(del);
    l->size--;
    return 1;
}

void print(const List *l)
{
    if (l->tail == NULL) { printf("Список пуст\n"); return; }
    Node *head = l->tail->next, *p = head;
    do {
        printf("%d -> ", p->data);
        p = p->next;
    } while (p != head);
    printf("(к началу: %d)\n", head->data);
}

void destroy(List *l)
{
    for (int i = 0; i < l->size; i++) {
        Node *t = l->tail->next;
        l->tail->next = t->next;
        free(t);
    }
    l->tail = NULL;
    l->size = 0;
}

int main(void)
{
    List l;
    create(&l);
    for (int i = 1; i <= 6; i++) add(&l, i * 10);
    printf("Исходный список:\n");
    print(&l);
    remove_middle(&l, 4);
    printf("После удаления 4-го элемента:\n");
    print(&l);
    printf("Попытка удалить первый: %s\n", remove_middle(&l, 1) ? "удалён" : "отказ");
    printf("Попытка удалить последний: %s\n", remove_middle(&l, l.size) ? "удалён" : "отказ");
    destroy(&l);
    return 0;
}
