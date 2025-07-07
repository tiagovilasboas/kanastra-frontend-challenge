module.exports = function (plop) {
  plop.setGenerator('component', {
    description: 'Cria um componente React',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Nome do componente',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/components/{{pascalCase name}}/{{pascalCase name}}.tsx',
        templateFile: 'plop-templates/component.tsx.hbs',
      },
      {
        type: 'add',
        path: 'src/components/{{pascalCase name}}/{{pascalCase name}}.test.tsx',
        templateFile: 'plop-templates/component.test.tsx.hbs',
      },
      {
        type: 'add',
        path: 'plop-templates/component.tsx.hbs',
        template: `import { {{pascalCase name}}Props } from './{{pascalCase name}}.types'

export function {{pascalCase name}}({}: {{pascalCase name}}Props) {
  return <div>{{pascalCase name}}</div>
}
`,
      },
      {
        type: 'add',
        path: 'plop-templates/component.test.tsx.hbs',
        template: `import { render, screen } from '@testing-library/react'
import { {{pascalCase name}} } from './{{pascalCase name}}'

describe('{{pascalCase name}}', () => {
  it('renders correctly', () => {
    render(<{{pascalCase name}} />)
    expect(screen.getByText(/{{pascalCase name}}/i)).toBeInTheDocument()
  })
})
`,
      },
    ],
  })

  plop.setGenerator('feature', {
    description: 'Cria uma feature completa (API fake, store Zustand, componente Mantine, testes)',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Nome da feature',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/features/{{camelCase name}}/api/{{camelCase name}}Api.ts',
        templateFile: 'plop-templates/feature/api.ts.hbs',
      },
      {
        type: 'add',
        path: 'src/features/{{camelCase name}}/store/use{{pascalCase name}}Store.ts',
        templateFile: 'plop-templates/feature/store.ts.hbs',
      },
      {
        type: 'add',
        path: 'src/features/{{camelCase name}}/components/{{pascalCase name}}.tsx',
        templateFile: 'plop-templates/feature/component.tsx.hbs',
      },
      {
        type: 'add',
        path: 'src/features/{{camelCase name}}/components/{{pascalCase name}}.test.tsx',
        templateFile: 'plop-templates/feature/component.test.tsx.hbs',
      },
    ],
  })
}
