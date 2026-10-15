#include <stdio.h>
#include <stdlib.h>

/* Задача 1. Стек на односвязном списке */
typedef struct Node {
    int data;
    struct Node *next;
} Node;

typedef struct {
    Node *top;      /* вершина стека */
    int size;
} Stack;

void create(Stack *s) { s->top = NULL; s->size = 0; }

int push(Stack *s, int value)
{
    Node *n = (Node *)malloc(sizeof(Node));
    if (n == NULL) return 0;
    n->data = value;
    n->next = s->top;
    s->top = n;
    s->size++;
    return 1;
}

/* Удаление элемента из середины (не первого и не последнего).
   pos - номер элемента от вершины, 2 .. size-1 */
int remove_middle(Stack *s, int pos)
{
    if (pos < 2 || pos > s->size - 1) return 0;
    Node *prev = s->top;
    for (int i = 1; i < pos - 1; i++) prev = prev->next;
    Node *del = prev->next;
    prev->next = del->next;
    free(del);
    s->size--;
    return 1;
}

void print(const Stack *s)
{
    if (s->top == NULL) { printf("Стек пуст\n"); return; }
    printf("Вершина -> ");
    for (Node *p = s->top; p != NULL; p = p->next)
        printf("%d%s", p->data, p->next ? " -> " : "\n");
}

void destroy(Stack *s)
{
    while (s->top) { Node *t = s->top; s->top = t->next; free(t); }
    s->size = 0;
}

int main(void)
{
    Stack s;
    create(&s);
    for (int i = 1; i <= 6; i++) push(&s, i * 10);
    printf("Исходный стек:\n");
    print(&s);
    int pos = 3;
    if (remove_middle(&s, pos))
        printf("Удалён элемент №%d (от вершины):\n", pos);
    print(&s);
    printf("Попытка удалить первый элемент: %s\n",
           remove_middle(&s, 1) ? "удалён" : "отказ (не середина)");
    printf("Попытка удалить последний элемент: %s\n",
           remove_middle(&s, s.size) ? "удалён" : "отказ (не середина)");
    destroy(&s);
    return 0;
}
