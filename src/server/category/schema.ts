import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';

extendZodWithOpenApi(z);

/**
 * 分类列表查询请求数据结构
 */
export const categoryListRequestParamsSchema = z.object({
  parent: z.string().optional().openapi({ description: '父分类ID' }),
});

/**
 * 分类面包屑查询请求数据结构
 */
export const categoryBreadcrumbRequestParamsSchema = z.object({
  latest: z.string().openapi({ description: '最后一个起始分类ID' }),
});

const baseCategorySchema = z.object({
  id: z.string().openapi({ description: '分类ID' }),
  name: z.string().openapi({ description: '分类名称' }),
  slug: z.string().or(z.null()).openapi({ description: '分类别名' }),
  path: z.string().openapi({ description: '分类路径' }),
  depth: z.number().openapi({ description: '分类深度' }),
  numchild: z.number().openapi({ description: '子分类数量' }),
});

type Category = z.infer<typeof baseCategorySchema> & {
  children?: Category[];
};

/**
 * 分类查询响应数据结构
 */
export const categorySchema: z.ZodType<Category> = baseCategorySchema
  .extend({
    children: z
      .lazy(() => z.array(categorySchema))
      .optional()
      .openapi({
        type: 'array',
        items: {
          $ref: '#/components/schemas/Category',
        },
      })
      .openapi({ description: '子分类列表' }),
  })
  .openapi({ ref: 'Category', description: '分类详情数据' });

/**
 * 分类列表查询响应数据结构
 */
export const categoryListSchema = z
  .array(baseCategorySchema)
  .openapi({ ref: 'CategoryList', description: '分类列表数据' });

/**
 * 分类树查询响应数据结构
 */
export const categoryTreeSchema = z
  .array(categorySchema)
  .openapi({ ref: 'CategoryTree', description: '分类树数据' });
