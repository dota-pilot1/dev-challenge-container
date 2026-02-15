# MyBatis + Spring Boot 프로젝트 핵심 구조

## 디렉토리 구조

```
src/main/
├── java/com/opro/concurrency/
│   ├── ConcurrencyLabApplication.java   # Spring Boot 메인 클래스
│   ├── controller/                      # REST API 진입점
│   │   └── ProductController.java
│   ├── service/                         # 비즈니스 로직
│   │   └── ProductService.java
│   ├── mapper/                          # MyBatis Mapper 인터페이스 (DAO 역할)
│   │   └── ProductMapper.java
│   └── dto/                             # 데이터 전달 객체
│       └── Product.java
└── resources/
    ├── application.properties           # DB 접속 정보, MyBatis 설정
    └── mapper/                          # SQL XML 파일
        └── ProductMapper.xml
```

## 각 계층 역할

### 1. Controller → 요청/응답 처리

```java
@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    @GetMapping("/{id}")
    public Product getProduct(@PathVariable Long id) {
        return productService.getProduct(id);
    }
}
```

### 2. Service → 비즈니스 로직 + 트랜잭션

```java
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductMapper productMapper;

    @Transactional
    public Product getProduct(Long id) {
        return productMapper.findById(id);
    }
}
```

### 3. Mapper 인터페이스 → DB 접근 (JPA의 Repository 역할)

```java
@Mapper
public interface ProductMapper {

    Product findById(Long id);

    void insert(Product product);

    void update(Product product);
}
```

- `@Mapper` 어노테이션으로 MyBatis가 구현체를 자동 생성
- 메서드 이름이 XML의 `id`와 매핑됨

### 4. Mapper XML → 실제 SQL 작성

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.opro.concurrency.mapper.ProductMapper">

    <select id="findById" resultType="com.opro.concurrency.dto.Product">
        SELECT id, name, price, stock
        FROM product
        WHERE id = #{id}
    </select>

    <insert id="insert">
        INSERT INTO product (name, price, stock)
        VALUES (#{name}, #{price}, #{stock})
    </insert>

    <update id="update">
        UPDATE product
        SET name = #{name}, price = #{price}, stock = #{stock}
        WHERE id = #{id}
    </update>

</mapper>
```

## 핵심 설정 (application.properties)

```properties
# DB 접속
spring.datasource.url=jdbc:postgresql://localhost:5432/concurrency_lab
spring.datasource.username=app_user
spring.datasource.password=app_password

# MyBatis
mybatis.mapper-locations=classpath:mapper/**/*.xml
mybatis.configuration.map-underscore-to-camel-case=true
```

| 설정 | 설명 |
|------|------|
| `mapper-locations` | XML 파일 위치. `mapper/` 하위 모든 XML을 스캔 |
| `map-underscore-to-camel-case` | DB `created_at` → Java `createdAt` 자동 변환 |

## JPA vs MyBatis 비교

| 항목 | JPA | MyBatis |
|------|-----|---------|
| SQL 작성 | 자동 생성 | 직접 작성 (XML) |
| 테이블 생성 | `ddl-auto`로 자동 | 직접 DDL 실행 |
| DAO 계층 | Repository 인터페이스 | Mapper 인터페이스 + XML |
| 복잡한 쿼리 | JPQL/QueryDSL | 네이티브 SQL 그대로 |
| 학습 곡선 | 높음 (영속성 컨텍스트 등) | 낮음 (SQL만 알면 됨) |

## 요청 흐름

```
Client → Controller → Service → Mapper(인터페이스) → XML(SQL) → DB
```
