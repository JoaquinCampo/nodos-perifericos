Taller de Sistemas Empresariales
Laboratorio 2025
Instituto de Computaci´on - Facultad de Ingenier´ıa
Universidad de la Rep´ublica

1. Motivaci´on
   La integraci´on de sistemas de software operando en diferentes organizaciones de salud es cada vez m´as necesaria para intercambiar datos y llevar a cabo
   procesos de atenci´on m´edica de manera coordinada [1]. Esta integraci´on es fundamental, por ejemplo, para consultar la historia cl´ınica completa de un usuario
   de servicios de salud, que puede estar distribuida en diferentes organizaciones
   (p. ej. laboratorios, prestadores de salud).
   En Uruguay, el Sistema Nacional Integrado de Salud (SNIS) [2] reglamenta
   el derecho a la protecci´on de la salud de los habitantes del pa´ıs y establece el
   marco para que accedan a servicios integrales de salud, brindados tanto por
   prestadores p´ublicos como privados. El SNIS apunta a que los habitantes del
   pa´ıs cuenten con servicios de salud de la mejor calidad posible, accesibles lo
   m´as efectivamente posible e implementados globalmente de forma lo m´as racional posible, tendiendo al ✭✭aprovechamiento racional de los recursos humanos,
   materiales, financieros y de la capacidad sanitaria instalada y a instalarse✮✮ [3].
   Para lograr estos objetivos se requiere una fluida y sistem´atica integraci´on
   entre todos los actores de salud de Uruguay, por lo que desde hace varios a˜nos
   est´a en funcionamiento la Historia Cl´ınica Electr´onica Nacional (HCEN) [4].
   La HCEN se apoya en una Plataforma de Salud Digital que incluye, entre
   otros componentes, el ´Indice Nacional de Usuarios de Salud (INUS), el Registro
   Nacional de Documentos Cl´ınicos (RNDC) y Servicios HCEN. Los Servicios
   HCEN permiten el intercambio de informaci´on cl´ınica entre distintos actores del
   ecosistema. En particular, estos servicios permiten a un prestador dar de alta
   usuarios en el INUS, registrar metadatos de documentos cl´ınicos en el RNDC,
   recuperar de este registro la lista de documentos cl´ınicos asociados a un usuario,
   y recuperar documentos cl´ınicos espec´ıficos alojados en otros prestadores.
   En este laboratorio se propone implementar el esquema general de la HCEN,
   haciendo foco en los componentes INUS, RNDC y la configuraci´on de pol´ıticas
   de acceso por parte de los usuarios de salud. Adem´as, se apunta a brindar una
   alternativa ´agil para actores del sistema de salud que, no siendo prestadores
   integrales o parciales, desean integrarse al sistema (p. ej. cl´ınicas, laboratorios).
   1
2. Descripci´on General
   Como se puede observar en la Figura 1, la soluci´on a construir (hcen.uy)
   cuenta con un ✭✭componente central✮✮, un ✭✭componente m´ovil✮✮ y un ✭✭componente perif´erico✮✮, que interact´uan con otros ✭✭nodos perif´ericos✮✮ y ✭✭sistemas
   externos✮✮. Estos elementos permiten brindar funcionalidades a cuatro tipos de
   usuarios: ✭✭Administrador HCEN✮✮, ✭✭Usuario de Salud✮✮, ✭✭Profesional de Salud✮✮
   y ✭✭Administrador Cl´ınica✮✮.
   Figura 1: Descripci´on General de hcen.uy
   El ✭✭componente central✮✮ debe contar con un ✭✭Portal Admin HCEN✮✮ y un
   ✭✭Portal para Usuarios de Salud✮✮. El ✭✭Portal Admin HCEN✮✮ debe brindar funcionalidades para la configuraci´on de la plataforma, as´ı como para la administraci´on del ✭✭componente perif´erico✮✮. El ✭✭Portal para Usuarios de Salud✮✮ debe
   brindar funcionalidades para los ✭✭Usuarios de Salud✮✮, que permitan obtener su
   informaci´on cl´ınica as´ı como configurar pol´ıticas para su acceso.
   El ✭✭componente m´ovil✮✮ (en comunicaci´on con el central) debe brindar funcionalidades similares a las provistas por el ✭✭Portal para Usuarios de Salud✮✮.
   El ✭✭componente perif´erico✮✮ sigue un modelo multi-tenant [5] y debe contar
   con un ✭✭Portal Admin Cl´ınica✮✮ y un ✭✭Portal para Profesionales de Salud✮✮. El
   ✭✭Portal Admin Cl´ınica✮✮ debe brindar funcionalidades para la administraci´on de
   una Cl´ınica (p. ej. ABM de profesionales de salud). El ✭✭Portal para Profesionales
   de Salud✮✮ debe brindar funcionalidades orientadas a estos profesionales (p. ej.
   consultar historia cl´ınica, registrar documento cl´ınico).
   2
3. Requerimientos Funcionales
   Esta secci´on presenta los requerimientos funcionales de la plataforma.
   3.1. Portal para Usuarios de Salud
4. Autenticaci´on de usuarios mediante Usuario gub.uy1
   .
5. Visualizaci´on de historia cl´ınica.
6. Gesti´on de pol´ıticas de acceso sobre historia cl´ınica (p. ej. otorgados a
   cl´ınicas, profesionales con determinada especialidad).
7. Configuraci´on de notificaciones a recibir en componente M´ovil (p. ej. nuevo pedido de acceso, nuevo acceso a historia cl´ınica).
8. Visualizaci´on de accesos a historia cl´ınica (i.e. qui´en consult´o la historia
   cl´ınica y cu´ando).
   3.2. Componente M´ovil
9. Autenticaci´on de usuarios mediante Usuario gub.uy.
10. Recepci´on de notificaciones (p. ej. nuevo pedido de acceso, nuevo acceso
    a historia cl´ınica).
11. Obtener resumen digital del paciente (p. ej. utilizando IPS-FHIR2
    )
    3.3. Portal Admin HCEN
12. Autenticaci´on de usuarios mediante Usuario gub.uy.
13. Gesti´on de cl´ınicas.
14. Reportes y an´alisis agregados de datos asociados al INUS, RNDC y pol´ıticas de acceso (p. ej. evoluci´on en tiempo de nueva informaci´on y accesos).
    3.4. Portal Admin Cl´ınica
15. Autenticaci´on de usuarios mediante mecanismo interno.
16. Gesti´on de usuarios de salud de la cl´ınica (incluyendo interacci´on con
    INUS).
17. Gesti´on de profesionales de salud de la cl´ınica, incluyendo su especialidad.
18. Modificar el look & feel y logos para personalizar el portal de la cl´ınica.
19. Habilitar soporte para la conexi´on como nodo perif´erico.
    1https://www.gub.uy/agencia-gobierno-electronico-sociedad-informacion-conocimiento/
    comunicacion/publicaciones/documentacion-tecnica-id-uruguay/documentacion-tecnica-id-uruguay/
    id-0
    2https://build.fhir.org/ig/HL7/fhir-ips/
    3
    3.5. Portal para Profesionales de Salud
20. Autenticaci´on de usuarios mediante mecanismo interno.
21. Alta de documentos cl´ınicos (incluyendo registro de metadatos en RNDC).
22. Acceso a la historia cl´ınica de un paciente. Se debe poder acceder tanto a
    documentos cl´ınicos alojados en la cl´ınica como a documentos alojados en
    otras cl´ınicas o nodos perif´ericos, a trav´es del nodo central y de acuerdo
    a las pol´ıticas de acceso definidas por los usuarios.
23. Solicitar acceso a documento cl´ınico.
    3.6. Prestadores de Salud
    La plataforma debe brindar una implementaci´on de referencia para estos
    componentes, que cuente con una interfaz de servicios que permita obtener un
    documento cl´ınico.
    3.7. Integraci´on con Otros Sistemas
    Esta secci´on describe las formas de establecer la integraci´on del ✭✭componente
    central✮✮ con los nodos perif´ericos y sistemas externos.
    3.7.1. Integraci´on con Plataforma de Interoperabilidad
    La integraci´on entre hcen.uy y la Plataforma de Interoperabilidad (PDI)
    se lleva a cabo para obtener datos de los ✭✭Usuarios de Salud✮✮, que permitan
    establecer si cumple las condiciones para poder hacer uso de la plataforma.
    En particular, el ✭✭componente central✮✮ tiene que consumir el Servicio B´asico
    de Informaci´on3 ofrecido por DNIC para obtener la fecha de nacimiento del
    usuario y comprobar que es mayor de edad.
    Dado que los servicios de la PDI4 no son p´ublicos, se deben implementar
    servicios que los representen respetando (en la medida de lo posible) su interfaz.
    3https://www.gub.uy/agencia-gobierno-electronico-sociedad-informacion-conocimiento/
    politicas-y-gestion/servicio-basico-informacion
    4https://www.gub.uy/agencia-gobierno-electronico-sociedad-informacion-conocimiento/
    tematica/catalogo-plataforma-interoperabilidad
    4
    3.7.2. Integraci´on con Componentes en Nodos Perif´ericos
    El ✭✭componente central✮✮ se tiene que integrar con ✭✭nodos perif´ericos✮✮ en
    tres situaciones:
24. La integraci´on se da cuando desde el ✭✭componente central✮✮ se solicita
    informaci´on cl´ınica de un usuario, ya sea porque el usuario la quiere obtener desde el ✭✭Portal para Usuarios de Salud✮✮ o porque un ✭✭Profesional de
    Salud✮✮ la quiere consultar desde un ✭✭nodo perif´erico✮✮. Esta integraci´on
    requiere que los componentes cuenten con una interfaz bien definida, a
    trav´es de la cual el ✭✭componente central✮✮ pueda interactuar para obtener
    la informaci´on cl´ınica de los ✭✭Usuarios de Salud✮✮.
25. La integraci´on ocurre cuando en un componente alojado en un nodo perif´erico se da de alta un usuario o un documento cl´ınico. Esta integraci´on
    requiere que el ✭✭componente central✮✮ cuente con una interfaz bien definida, a trav´es de la cual los componentes en los nodos perif´ericos puedan
    enviar la informaci´on requerida para actualizar el INUS (en caso de un
    alta de usuario) o el RNDC (en caso de un alta de documento cl´ınico).
26. La integraci´on se da cuando desde el ✭✭componente central✮✮ se realiza el alta de una cl´ınica. Esta integraci´on requiere que el ✭✭componente perif´erico✮✮
    cuente con una interfaz bien definida, a trav´es de la cual el ✭✭componente
    central✮✮ pueda enviar la informaci´on requerida para que una cl´ınica pueda
    comenzar a utilizar los portales ofrecidos por el ✭✭componente perif´erico✮✮.
    Se recomienda fuertemente consultar m´as detalles sobres las interacciones
    de los puntos 1 y 2 en [6].
    3.7.3. Integraci´on con Usuario gub.uy
    Esta integraci´on se da al momento de realizar la autenticaci´on de usuarios
    utilizando Usuario gub.uy.
27. Requerimientos No Funcionales
    4.1. Aspectos de Comunicaci´on
28. La comunicaci´on entre el componente central y la PDI debe realizarse
    mediante Web Services SOAP.
29. La comunicaci´on entre el componente m´ovil y el componente central debe
    realizarse mediante Web Services REST.
30. La comunicaci´on entre el componente central y los componentes en los
    nodos perif´ericos debe realizarse utilizando los mecanismos m´as adecuados
    5
    seg´un el caso. Se debe analizar, por ejemplo, si estas interacciones deben
    ser one-way, request-response, sincr´onicas, asincr´onicas, etc.
    4.2. Aspectos de Seguridad
31. Proteger la contrase˜na de usuarios utilizando funciones hash con salt en
    su almacenamiento.
32. Las interacciones del componente central con los componentes perif´ericos,
    plataformas y componente m´ovil deben realizarse utilizando HTTPS.
    4.3. Aspectos de Escalabilidad y Performance
33. Dise˜nar el sistema para que sea escalable horizontalmente a nivel de servidor Web o servidor de aplicaciones. Para esto se recomienda no guardar
    estado de forma local en servidores Web / de aplicaci´on.
34. Identificar situaciones de uso pico de la plataforma y modelar la realidad
    de uso prevista.
35. Realizar una prueba de performance del sistema siguiendo la realidad
    planteada con los siguientes objetivos:
    a) Verificar que los tiempos de respuesta no se degraden a lo largo de
    la prueba
    b) Encontrar el punto de quiebre del sistema
    c) Identificar cuellos de botella que impiden que la aplicaci´on responda
    de forma aceptable.
    4.4. Aspectos de Cubrimiento con Pruebas
    Se apunta a tener un cubrimiento de aproximadamente 80 % de la l´ogica del
    sistema con pruebas automatizadas y al menos una prueba por cada servicio.
    Analizar el impacto que tiene el nivel de cubrimiento logrado en el funcionamiento de la plataforma.
    4.5. Aspectos de Ejecuci´on
    El componente central debe ejecutarse en la soluci´on Elastic Cloud5 de ANTEL, para lo cual se entregar´an c´odigos promocionales.
    Los componentes perif´ericos deben ejecutarse en otras soluciones Platform
    as a Service (PaaS) o Infrastructure as a Service (IaaS) que brinden cuentas
    gratuitas6
    .
    5https://minubeantel.uy/index.php?NAME_PATH=Elastic_Cloud
    6ver https://education.github.com/pack
    6
36. Requerimientos Opcionales
    Los grupos de ingenier´ıa deber´an realizar al menos tres (3) puntos de requerimientos opcionales, mientras que los del tecn´ologo al menos un (1) punto.
37. Integraci´on con LLM para alguna de las funcionalidades de la plataforma.

- 1 punto

2. Chat y videollamada entre usuarios y profesionales de salud (componente
   perif´erico). - 1 punto
3. Utilizaci´on de una base de datos NoSQL (p. ej: documental, grafos) para
   la persistencia de una parte de los datos del sistema. - 1 punto
4. Utilizaci´on de herramientas orientadas a la calidad del c´odigo fuente (p.
   ej. Sonarqube). - 1 punto
5. Firmar digitalmente un documento cl´ınico para garantizar su integridad
   (componente perif´erico). - 1 punto
6. Integraci´on entre grupos. Integrarse como nodo perif´erico a la soluci´on de
   otro grupo (bidireccional). - 1 punto
7. Automatizaci´on de instalaci´on inicial de la plataforma (p. ej. utilizando
   Ansible, Terraform, etc). - 1 punto
8. Utilizaci´on de Blockchain para alguna de las funcionalidades de la plataforma. - 1 punto
9. Utilizaci´on de Servicios Terminol´ogicos7 para alguna de las funcionalidades de la plataforma. - 1 punto
   7https://arquitecturadegobierno.agesic.gub.uy/docs/salud/modelos-referencia/
   arquitectura-negocio/servicios-complemeantarios
   7
10. Plazos de Entrega
    Primera Entrega Arquitectura y Dise˜no: 15 de Setiembre
    Segunda Entrega Arquitectura y Dise˜no: 6 de Octubre
    Entrega Prototipo Arquitectura: 20 de Octubre
    Entrega Preliminar Art´ıculo T´ecnico: 27 de Octubre
    Entrega Prototipo Avanzado: 3 de Noviembre
    Entrega Final: 17 de Noviembre
    Presentaciones Finales: Semana del 24 de Noviembre y/o 1 de Diciembre.
11. Monitoreos
    Los monitoreos ser´an realizados una vez por semana con una presentaci´on
    del avance del trabajo al docente a cargo. El docente se encargar´a de realizar
    los comentarios pertinentes acerca del mismo. En los monitoreos con los grupos
    se utilizar´a el concepto de entregable, que puede ser, de acuerdo al momento,
    una presentaci´on PPT, un documento de avance o un prototipo del producto.
    En todos los monitoreos cada grupo debe traer un entregable, el cual se
    utilizar´a como base de discusi´on. Esto busca promover que los grupos estructuren y organicen sus consultas en torno al trabajo hecho en los d´ıas previos. El
    docente puede solicitar entregables adicionales a los estipulados para el curso.
12. Entrega Final
    La entrega final debe constar de:
13. C´odigo fuente de todas las funcionalidades (Gitlab de FING)
14. Archivo de nombre readme con una explicaci´on r´apida de par´ametros u
    opciones que considere necesario aclarar. El archivo no debe contener m´as
    de una carilla.
15. Documento de Arquitectura y Dise˜no de la soluci´on.
16. Documento tipo paper con la presentaci´on de la soluci´on, de entre 8 y 12
    p´aginas. (para Ingenier´ıa)
17. Juego de datos de prueba.
18. Peque˜no Video de Demo del Sistema.
19. Conjunto de Screenshots del Sistema.
    8
    Referencias
    [1] Gilad J Kuperman. ✭✭Health-information exchange: why are we doing it, and what are
    we doing?✮✮ En: Journal of the American Medical Informatics Association 18.5 (2011),
    p´ag. 678. doi: 10.1136/amiajnl-2010-000021.
    [2] Poder Legislativo de Uruguay. Ley 18211: Creaci´on del Sistema Nacional Integrado de
    Salud. 13 de dic. de 2007. url: https : / / www . impo . com . uy / bases / leyes / 18211 -
    2007/61.
    [3] Salud Digital. https : / / arquitecturadegobierno . agesic . gub . uy / docs / salud /
    Introducci%C3%B3n/contextomotivacion. 2019.
    [4] Ecosistema de Salud de Uruguay. https://arquitecturadegobierno.agesic.gub.uy/
    docs/salud/Introducci%C3%B3n/ecosistemadesalud. 2019.
    [5] Jaap Kabbedijk et al. ✭✭Defining multi-tenancy: A systematic mapping study on the academic and the industrial perspective✮✮. En: Journal of Systems and Software 100 (2015),
    p´ags. 139-148. issn: 0164-1212.
    [6] Servicios HCEN. https://arquitecturadegobierno.agesic.gub.uy/docs/salud/
    modelos-referencia/arquitectura-negocio/servicios-hcen. 2019.
    9
