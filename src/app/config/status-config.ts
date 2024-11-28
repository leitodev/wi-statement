/*
Active — Материал активен и доступен для использования.
Obsolete — Материал устарел и больше не используется.
Pending Approval — Материал ожидает утверждения (например, нового поставщика или компонента).
Under Review — Материал находится в процессе пересмотра (например, при смене регуляторных требований).
Discontinued — Материал снят с производства и больше не будет доступен.
In Development — Материал находится на стадии разработки, и его использование еще не разрешено.
Inactive — Материал временно не используется, но может быть снова активирован.
Prototype — Материал находится на стадии тестирования и не предназначен для массового использования.
Recalled — Материал отозван из-за несоответствия качеству или регуляторным требованиям.
Needs Review — Материал требует пересмотра или проверки в свете новых нормативов или изменений в бизнес-процессах.
Limited Availability — Материал доступен в ограниченном количестве или с ограничениями.
On Hold — Материал заморожен до разрешения какой-то проблемы или проверки.
*/
export const materialStatus = [
    { id: 1, name: 'active' },
    { id: 2, name: 'obsolete' },
    { id: 3, name: 'pending approval' },
    { id: 4, name: 'under review' },
    { id: 5, name: 'discontinued' },
    { id: 6, name: 'in development' },
    { id: 7, name: 'inactive' },
    { id: 8, name: 'prototype' },
    { id: 9, name: 'recalled' },
    { id: 10, name: 'needs review' },
    { id: 11, name: 'limited availability' },
    { id: 12, name: 'on hold' }
];


/*
pending – Можно менять статус без документа.
na – Можно менять статус без документа.
does_not_comply – Можно менять статус без документа, но предложить возможность добавить комментарий.
comply – Обязательна загрузка документа для подтверждения.
comply_with_exceptions – Обязательна загрузка документа для подтверждения.
*/
export const complianceStatus = [
    { id: 1, name: 'pending' },
    { id: 2, name: 'na' },
    { id: 3, name: 'does_not_comply' },
    { id: 4, name: 'comply' },
    { id: 5, name: 'comply_with_exceptions' }
];