# Modelado de Datos · To-Dos

- [x] Mapear el diagrama propuesto a Prisma reemplazando `schema.prisma` con los modelos multi-tenant definidos (tenant_id + RLS).
- [x] Definir convenciones para enums: nombres en lower_snake_case (ej. `tenant_status`), valores en MAYÚSCULAS sin prefijos (`ACTIVE`, `SUSPENDED`).
- [ ] Resolver almacenamiento de metadatos RNDC e identificadores del nodo central. *(Pendiente, definir luego)*
- [x] Documentar catálogo de roles/permisos: usar `admin_clinica`, `prof_salud`, `operator`; solo `prof_salud` requiere fila en `Professional`.
- [x] Evaluar necesidad de motor NoSQL: mantener solo Postgres inicialmente; dejar abierta adopción futura de base NoSQL para opcionales.
- [ ] Planificar migraciones iniciales y estrategia de seeded data por tenant. *(Pendiente, decidir más adelante)*
- [ ] Diseñar fixtures para pruebas y ambientes de demo. *(Pendiente, abordar más adelante)*
- [x] Revisar versionado de documentos: incrementar `version` automáticamente por documento y conservar versiones previas como histórico.
