# CF-Microservice-Api-Catalog

Microsserviço - Backend do catálogo de vídeos com NodeJS da CodeFlix

### Arquitetura e requisitos do projeto

[Documentação completa aqui.](https://github.com/alessandroprudencio/CodeFlix)

#### Pré-requisitos

O que você precisa para instalar o software

```
Docker
```

```
Docker Compose
```

### Instalação

```
git clone git@github.com:alessandroprudencio/CF-Microservice-Api-Catalog.git
```

```
cd CF-Microservice-Api-Catalog
```

```
docker-compose up -d
```

Pronto sua aplicação estará rodando no endereço http://localhost:3000

## Testes

```sh
yarn test
```

## Podem ocorrer erros ao executar o projeto, segue as soluções

Permissões na pasta .docker/elasticdata

```
sudo chmod 777 ./.docker/elasticdata
```

Ajustes nos limites de memória

```
sudo sysctl -w vm.max_map_count=262144
```

## Construído com

- [Node.js](https://nodejs.org/)
- [LoopBack](https://loopback.io/)
- [ElasticSearch](https://www.elastic.co/)
- [Kibana](https://www.elastic.co/pt/kibana)
- [RabbitMQ](https://www.rabbitmq.com/)

## Contribuição

Faça um Fork do projeto Crie uma Branch para sua Feature (git checkout -b feature/FeatureIncrivel)
Adicione suas mudanças (git add .)
Comite suas mudanças (git commit -m 'Adicionando uma Feature incrível!)
Faça o Push da Branch (git push origin feature/FeatureIncrivel)
Abra um Pull Request

## Author

- Alessandro Prudencio
- alessandroconectado@gmail.com
- +55 (67) 99269-6705
- [Linkedin](https://www.linkedin.com/in/alessandro-prudencio/)
