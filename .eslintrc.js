const { rules: airbnbSharedRules } = require('eslint-config-airbnb-typescript/lib/shared');
const { rules: airbnbVariableRules } = require('eslint-config-airbnb-base/rules/variables');

module.exports = {
  "root": true,
  "ignorePatterns": [
    "debian/**/*",
    "docker/**/*",
    "ports/**/*",
    "scripts/**/*",
    "tests/**/*",
    "node_modules/**/*",
  ],
  "overrides": [
    {
      "files": ["*.ts"],
      "parser": "@typescript-eslint/parser",
      "parserOptions": {
        "createDefaultProgram": true,
        "tsconfigRootDir": __dirname,
        "project": ["./tsconfig.json"],
      },
      "extends": [
        "airbnb-typescript/base",
        "plugin:@angular-eslint/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:rxjs/recommended",
        "plugin:sonarjs/recommended"
      ],
      "plugins": [
        "rxjs",
        "rxjs-angular",
        "unicorn",
        "angular-file-naming",
        "@shopify",
        "unused-imports",
        "sonarjs",
      ],
      "rules": {
        // TODO: Conflicts with ngx-translate-extract
        "prefer-template": "off",

        // Consciously altered
        "no-underscore-dangle": "off",
        "class-methods-use-this": "off",
        "import/prefer-default-export": "off",
        "no-continue": "off",
        "prefer-destructuring": "off",
        "operator-assignment": "off",
        "no-return-assign": "off",
        "no-empty": ["error", { "allowEmptyCatch": true }],
        "arrow-body-style": "off",
        "no-bitwise": "off",
        "max-len": ["error", 120, 2, {
          "ignoreUrls": true,
          "ignoreComments": false,
          "ignoreRegExpLiterals": true,
          "ignoreStrings": true, // TODO: Consider enabling later.
          "ignoreTemplateLiterals": true
        }],
        "radix": "off",
        "no-console": ["error", { allow: ["warn", "error", "info"] }],
        "import/order": ["error", {
          "groups": ["builtin", "external", ["internal", "parent", "sibling", "index"]],
          "pathGroups": [
            {
              "pattern": "app/**",
              "group": "parent",
              "position": "before",
            }
          ],
          "pathGroupsExcludedImportTypes": ["builtin", "internal"],
          "newlines-between": "never",
          "alphabetize": {
            "order": "asc",
            "caseInsensitive": false
          }
         }],
        "import/no-duplicates": ["error", {"considerQueryString": true}],
        "import/extensions": ["error", "ignorePackages", {
          "js": "never",
          "jsx": "never",
          "ts": "never",
          "tsx": "never"
        }],
        "@typescript-eslint/no-use-before-define": ["error", "nofunc"],
        "no-prototype-builtins": "off",
        "no-trailing-spaces": ["error"],
        "@typescript-eslint/unbound-method": "off",
        "@typescript-eslint/no-misused-promises": ["error", { checksVoidReturn: false }],
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: ['typeLike'],
            format: ['StrictPascalCase'],
            filter: {
              // Allow two letter combinations at the start, like VDev
              regex: '^[A-Z][A-Z]',
              match: false,
            }
          },
          {
            selector: ['typeLike'],
            format: ['PascalCase'],
          },
          {
            selector: ['enumMember'],
            format: ['StrictPascalCase'],
          },
          {
            selector: 'function',
            format: ['strictCamelCase'],
          },
          {
            selector: ['classMethod', 'objectLiteralMethod', 'typeMethod'],
            format: ['strictCamelCase'],
          },
          {
            selector: ['classProperty'],
            format: ['strictCamelCase', 'StrictPascalCase', 'UPPER_CASE'],
            leadingUnderscore: 'allow', // TODO: Remove later
          },
          {
            selector: ['variable', 'parameter'],
            modifiers: ['unused'],
            format: ['strictCamelCase'],
            leadingUnderscore: 'allow',
          },
          {
            selector: ['variable', 'parameter'],
            format: ['strictCamelCase']
          },
        ],
        "@typescript-eslint/restrict-template-expressions": ["error", { allowNumber: true, allowAny: true }],
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/no-floating-promises": "off",
        "@typescript-eslint/dot-notation": ["error", { allowIndexSignaturePropertyAccess: true }],
        "sonarjs/prefer-single-boolean-return": ["off"],
        "no-plusplus": "off",

        // TODO: Airbnb rules that are disabled for now as they cannot be fixed automatically
        "consistent-return": "off",
        "no-restricted-syntax": ["error",
          // TODO: Partially implemented. ForOfStatement is allowed for now.
          {
            "selector": "ForInStatement",
            "message": "for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array."
          },
          {
            "selector": "LabeledStatement",
            "message": "Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand."
          },
          {
            "selector": "WithStatement",
            "message": "`with` is disallowed in strict mode because it makes code impossible to predict and optimize."
          },
          {
            selector: 'MemberExpression[property.name="get"][object.name="form"], MemberExpression[property.name="get"] > MemberExpression[property.name="form"]',
            message: "For type safety reasons prefer `controls.name` over `get('name')`",
          },
        ],
        "no-param-reassign": "off",
        "@typescript-eslint/no-loop-func": "off",
        "no-await-in-loop": "off",
        "no-multi-str": "off",
        "no-mixed-operators": ["error", {
          groups: [
            // TODO: Some operators from default config not implemented.
            ["&", "|", "^", "~", "<<", ">>", ">>>"],
            ["==", "!=", "===", "!==", ">", ">=", "<", "<="],
            ["&&", "||"],
            ["in", "instanceof"]
          ],
          allowSamePrecedence: true
        }],
        "default-case": "off",
        "@typescript-eslint/member-ordering": "off",

        // Other temporary disables
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-argument": "off",
        "rxjs/no-implicit-any-catch": ["off"],
        "rxjs/no-nested-subscribe": ["off"],
        "sonarjs/cognitive-complexity": ["error", 60],

        // Other overwrites
        "@typescript-eslint/lines-between-class-members": "off",
        "@typescript-eslint/indent": ["error", 2, {
          ...airbnbSharedRules['@typescript-eslint/indent'][2],
          ignoredNodes: [
            ...airbnbSharedRules['@typescript-eslint/indent'][2]['ignoredNodes'],
            "PropertyDefinition[decorators]",
          ]
        }],
        "@typescript-eslint/restrict-plus-operands": ["error", { allowAny: true }],
        "no-restricted-globals": [
          "error",
          ...airbnbVariableRules['no-restricted-globals'].slice(1),
          {
            "name": "window",
            "message": "Use the injected window service instead. Search for @Inject(WINDOW)."
          }
        ],
        "sonarjs/no-duplicate-string": ["off"],

        // Extra rules
        "@angular-eslint/use-lifecycle-interface": ["error"],
        "@typescript-eslint/array-type": "error",
        "@typescript-eslint/explicit-member-accessibility": ["error", { accessibility: "no-public" }],
        "@typescript-eslint/no-inferrable-types": "error",
        "@typescript-eslint/ban-tslint-comment": "error",
        "@typescript-eslint/member-delimiter-style": "error",
        "@typescript-eslint/type-annotation-spacing": "error",
        "@typescript-eslint/ban-ts-comment": "error",
        "@typescript-eslint/explicit-function-return-type": ["error", { allowExpressions: true }],
        "@typescript-eslint/consistent-type-assertions": ["error"],
        "@typescript-eslint/no-implicit-any-catch": ["error"],
        "@typescript-eslint/no-unnecessary-boolean-literal-compare": ["error"],
        "@typescript-eslint/prefer-includes": ["error"],
        "@typescript-eslint/prefer-for-of": ["error"],
        "@typescript-eslint/prefer-as-const": ["error"],
        "@typescript-eslint/consistent-generic-constructors": ["error"],
        "@angular-eslint/use-component-view-encapsulation": ["error"],
        "@typescript-eslint/no-unused-vars": "off",
        "unused-imports/no-unused-imports": "error",
        "unused-imports/no-unused-vars": ["error", {
          vars: "local",
          args: "after-used",
          argsIgnorePattern: "^_$",
          ignoreRestSiblings: true,
        }],
        "id-denylist": ["error", "res"],
        "@typescript-eslint/ban-types": ["error", {
          extendDefaults: true,
          types: {
            UntypedFormBuilder: 'Prefer normal typed FormBuilder.',
          }
        }],
        "unicorn/filename-case": ["error", { case: "kebabCase"}],
        "unicorn/prefer-array-find": ["error"],
        "@angular-eslint/component-selector": ["error", {
          "type": "element",
          "prefix": "ix",
          "style": "kebab-case"
        }],
        "@angular-eslint/component-max-inline-declarations": ["error"],
        "@angular-eslint/contextual-decorator": ["error"],
        "@angular-eslint/contextual-lifecycle": ["error"],
        "no-restricted-imports": ["error", {
          "paths": [{
            "name": "@ngneat/spectator",
            "importNames": ["createComponentFactory", "createHostFactory", "createRoutingFactory", "mockProvider"],
            "message": "Use imports from @ngneat/spectator/jest instead."
          }, {
            "name": "@angular/material/icon",
            "importNames": ["MatIconModule"],
            "message": "Use IxIconModule instead."
          }],
          "patterns": [{
            "group": [ "../**"],
            "message": "Use alias 'app' to replace part '../' of the path."
          }],
        }],
        "@shopify/typescript/prefer-singular-enums": "error",
        "@shopify/prefer-early-return": ["error", { maximumStatements: 3 }],

        // RxJS rules
        "rxjs/no-unsafe-takeuntil": ["error", {
          "alias": ["untilDestroyed"]
        }],
        "rxjs-angular/prefer-takeuntil": ["error", {
          "alias": ["untilDestroyed"],
          "checkComplete": false,
          "checkDecorators": ["Component"],
          "checkDestroy": false
        }],
        "rxjs/finnish": ["error", {
          "parameters": true,
          "properties": false, // TODO: Should be true, hard to implement now.
          "variables": true,
          "functions": false,
          "methods": false,
        }],
        "rxjs/prefer-observer": ["error"],
        "id-length": ["error", {
          exceptions: ['a', 'b', 'x', 'y', '_', 'i', 'n'],
          properties: 'never',
        }],

        // File Naming
        "angular-file-naming/component-filename-suffix": "error",
        "angular-file-naming/directive-filename-suffix": "error",
        "angular-file-naming/module-filename-suffix": "error",
        "angular-file-naming/pipe-filename-suffix": "error",
        "angular-file-naming/service-filename-suffix": ["error", {
          "suffixes": ["service", "effects", "store", "guard", "pipe"]
        }],
      }
    },
    {
      "files": ["**/*.spec.ts"],
      "plugins": ["jest"],
      "extends": ["plugin:jest/recommended", "plugin:jest/style"],
      "rules": {
        "jest/no-large-snapshots": ["error"],
        "jest/prefer-equality-matcher": ["error"],
        "jest/prefer-lowercase-title": ["error", { "ignore": ["describe"] }],
        "jest/expect-expect": [
          "error",
          {
            "assertFunctionNames": ["expect", "expectObservable"],
          }
        ]
      }
    },
    {
      "files": ["*.html"],
      "extends": ["plugin:@angular-eslint/template/recommended"],
      "plugins": ["angular-test-ids"],
      "rules": {
        "@angular-eslint/template/attributes-order": ["error"],
        "@angular-eslint/template/no-duplicate-attributes": ['error'],
        "@angular-eslint/template/no-interpolation-in-attributes": ['error'],
        "angular-test-ids/require-test-id": ["error", {
          "attribute": "ixTest",
          "overrideElements": [
            "button", "input", "select", "textarea", "option", "mat-radio-group",
            "mat-radio-button", "mat-chip-list", "mat-chip"
          ],
        }],

        // TODO: To be enabled later
        '@angular-eslint/template/use-track-by-function': ['off'],
        '@angular-eslint/template/no-negated-async': ['off'],
      }
    }
  ]
}
