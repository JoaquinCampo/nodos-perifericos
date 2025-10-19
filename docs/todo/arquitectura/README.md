# Arquitectura · To-Dos

- [x] Definir alcance de Next.js: expone UI y APIs internas multi-tenant (route handlers/tRPC) para interacción directa con el componente central.
- [x] Evaluar impacto de cada alternativa en despliegue y seguridad: desplegar servicio Next.js único detrás de reverse proxy HTTPS; acceso API del componente central restringido por VPN/allow-list y sin exponer base.
- [x] Elegir estrategia de multi-tenant: esquema compartido con columna `tenant_id` + RLS en Postgres; Prisma configurado para inyectar el tenant en cada request.
- [ ] Documentar implicancias operativas de la elección (migraciones, aislamiento, costos). *(Pendiente de completar más adelante)*
- [x] Delimitar módulos y rutas: usar app router con grupos `(admin)/admin/...` y `(professional)/professional/...`, cada uno con layout y guardias específicos.
- [x] Diseñar estrategia de comunicación con el componente central: consumir y exponer únicamente APIs REST sobre HTTPS autenticadas.
- [ ] Establecer contratos de servicio (versionado, autenticación, resiliencia). *(Pendiente, definir más adelante)*
- [x] Definir patrón para lógica compartida: estructura por dominio `src/server/modules/<dominio>/{repository,service}.ts`; UI consume tRPC/hooks especializados.
- [ ] Acordar convención para inyección de dependencias y pruebas unitarias. *(Pendiente, definir más adelante)*
