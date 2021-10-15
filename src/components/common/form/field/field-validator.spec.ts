import i18next from 'i18next';
import { FieldValidator } from './field-validator';

describe('FieldValidator', () => {
  describe('validateRequire', () => {
    [
      {
        character: '\t',
        characterName: 'tabulation',
      },
      {
        character: '\n',
        characterName: 'line feed',
      },
      {
        character: '\v',
        characterName: 'line tabulation',
      },
      {
        character: '\f',
        characterName: 'form feed',
      },
      {
        character: '\r',
        characterName: 'carriage return',
      },
      {
        character: ' ',
        characterName: 'space',
      },
      {
        character: '\xa0',
        characterName: 'no break space',
      },
    ].forEach((testScenario) => {
      it(`should not return error if value is wrapped in ${testScenario.characterName} characters`, () => {
        // given
        const value = `${testScenario.character}Some value${testScenario.character}`;

        // when
        const requireError = FieldValidator.validateRequire(value);

        // then
        expect(requireError).toBe('');
      });

      it(`should return error if value is ${testScenario.characterName} character`, () => {
        // given
        const error = 'This field is required';
        jest.spyOn(i18next, 't').mockReturnValue(error);

        // when
        const requireError = FieldValidator.validateRequire(
          testScenario.character
        );

        // then
        expect(requireError).toBe(error);
        expect(i18next.t).toHaveBeenCalledWith('COMMON.REQUIRED_ERROR');
      });

      it(`should return error if value contains multiple ${testScenario.character} characters`, () => {
        // given
        const error = 'This field is required';
        jest.spyOn(i18next, 't').mockReturnValue(error);
        const value = `${testScenario.character}${testScenario.character}${testScenario.character}`;

        // when
        const requireError = FieldValidator.validateRequire(value);

        // then
        expect(requireError).toBe(error);
        expect(i18next.t).toHaveBeenCalledWith('COMMON.REQUIRED_ERROR');
      });
    });

    it('should not return error if value has not white space', () => {
      // given
      const value = 'Some value';

      // when
      const requireError = FieldValidator.validateRequire(value);

      // then
      expect(requireError).toBe('');
    });
  });

  describe('validateEmail', () => {
    describe('Correct email', () => {
      const userNameCorrectSymbols = [
        {
          character: '!',
          characterDescription: 'exclamation mark',
        },
        {
          character: '#',
          characterDescription: 'hash',
        },
        {
          character: '$',
          characterDescription: 'dollar',
        },
        {
          character: '`',
          characterDescription: 'backtick',
        },
        {
          character: '~',
          characterDescription: 'tilde',
        },
        {
          character: '%',
          characterDescription: 'percentage',
        },
        {
          character: '^',
          characterDescription: 'caret',
        },
        {
          character: '&',
          characterDescription: 'ampersand',
        },
        {
          character: '*',
          characterDescription: 'asterisk',
        },
        {
          character: '-',
          characterDescription: 'minus',
        },
        {
          character: '_',
          characterDescription: 'underscore',
        },
        {
          character: '+',
          characterDescription: 'plus',
        },
        {
          character: '=',
          characterDescription: 'equal',
        },
        {
          character: 'w',
          characterDescription: 'lowercase',
        },
        {
          character: 'W',
          characterDescription: 'capital letters',
        },
        {
          character: '{',
          characterDescription: 'opening bracket',
        },
        {
          character: '}',
          characterDescription: 'closing bracket',
        },
        {
          character: '|',
          characterDescription: 'pipe',
        },
        {
          character: "'",
          characterDescription: 'apostrophe',
        },
        {
          character: 1,
          characterDescription: 'digit',
        },
        {
          character: '/',
          characterDescription: 'slash',
        },
        {
          character: '?',
          characterDescription: 'question mark',
        },
      ];

      [
        {
          character: '\t',
          characterName: 'tabulation',
        },
        {
          character: '\n',
          characterName: 'line feed',
        },
        {
          character: '\v',
          characterName: 'line tabulation',
        },
        {
          character: '\f',
          characterName: 'form feed',
        },
        {
          character: '\r',
          characterName: 'carriage return',
        },
        {
          character: ' ',
          characterName: 'space',
        },
        {
          character: '\xa0',
          characterName: 'no break space',
        },
        {
          character: '',
          characterName: 'no white space',
        },
      ].forEach((whitespaceTestCase) => {
        userNameCorrectSymbols.forEach((userNameSymbolTestCase1) => {
          it(`should not return error if email is wrapped in ${whitespaceTestCase.characterName} and has ${userNameSymbolTestCase1.characterDescription} character in only part before @ character`, () => {
            // given
            const email = `${whitespaceTestCase.character}${userNameSymbolTestCase1.character}@email.em${whitespaceTestCase.character}`;

            // when
            const emailError = FieldValidator.validateEmail(email);

            // then
            expect(emailError).toBe('');
          });

          it(`should not return error if email is wrapped in ${whitespaceTestCase.characterName} and has more than one ${userNameSymbolTestCase1.characterDescription} characters in only part before @ character`, () => {
            // given
            const email = `${whitespaceTestCase.character}${userNameSymbolTestCase1.character}${userNameSymbolTestCase1.character}@email.em${whitespaceTestCase.character}`;

            // when
            const emailError = FieldValidator.validateEmail(email);

            // then
            expect(emailError).toBe('');
          });

          userNameCorrectSymbols.forEach((userNameSymbolTestCase2) => {
            it(`should not return error if email is wrapped in ${whitespaceTestCase.characterName} and has ${userNameSymbolTestCase1.characterDescription} character in first part and ${userNameSymbolTestCase2.characterDescription} character in second part before @ character`, () => {
              // given
              const email = `${whitespaceTestCase.character}${userNameSymbolTestCase1.character}.${userNameSymbolTestCase2.character}@email.em${whitespaceTestCase.character}`;

              // when
              const emailError = FieldValidator.validateEmail(email);

              // then
              expect(emailError).toBe('');
            });

            it(`should not return error if email is wrapped in ${whitespaceTestCase.characterName} and has more than one ${userNameSymbolTestCase1.characterDescription} characters in first part and ${userNameSymbolTestCase2.characterDescription} character in second part before @ character`, () => {
              // given
              const email = `${whitespaceTestCase.character}${userNameSymbolTestCase1.character}${userNameSymbolTestCase1.character}.${userNameSymbolTestCase2.character}@email.em${whitespaceTestCase.character}`;

              // when
              const emailError = FieldValidator.validateEmail(email);

              // then
              expect(emailError).toBe('');
            });

            it(`should not return error if email is wrapped in ${whitespaceTestCase.characterName} and has ${userNameSymbolTestCase1.characterDescription} character in first part and more than one ${userNameSymbolTestCase2.characterDescription} characters in second part before @ character`, () => {
              // given
              const email = `${whitespaceTestCase.character}${userNameSymbolTestCase1.character}.${userNameSymbolTestCase2.character}${userNameSymbolTestCase2.character}@email.em${whitespaceTestCase.character}`;

              // when
              const emailError = FieldValidator.validateEmail(email);

              // then
              expect(emailError).toBe('');
            });

            it(`should not return error if email is wrapped in ${whitespaceTestCase.characterName} and has more than one ${userNameSymbolTestCase1.characterDescription} characters in first part and more than one ${userNameSymbolTestCase2.characterDescription} characters in second part before @ character`, () => {
              // given
              const email = `${whitespaceTestCase.character}${userNameSymbolTestCase1.character}${userNameSymbolTestCase1.character}.${userNameSymbolTestCase2.character}${userNameSymbolTestCase2.character}@email.em${whitespaceTestCase.character}`;

              // when
              const emailError = FieldValidator.validateEmail(email);

              // then
              expect(emailError).toBe('');
            });
          });
        });

        it(`should not return error if email is wrapped in ${whitespaceTestCase.characterName} and has more than two parts with correct characters before @ character`, () => {
          // given
          const email = `${whitespaceTestCase.character}a.b.c@email.em${whitespaceTestCase.character}`;

          // when
          const emailError = FieldValidator.validateEmail(email);

          // then
          expect(emailError).toBe('');
        });

        it(`should not return error if email is wrapped in ${whitespaceTestCase.characterName} and has character wrapped in quote before @ character`, () => {
          // given
          const email = `${whitespaceTestCase.character}"a"@email.em${whitespaceTestCase.character}`;

          // when
          const emailError = FieldValidator.validateEmail(email);

          // then
          expect(emailError).toBe('');
        });

        it(`should not return error if email is wrapped in ${whitespaceTestCase.characterName} and has more than one character wrapped in quote before @ character`, () => {
          // given
          const email = `${whitespaceTestCase.character}"ab"@email.em${whitespaceTestCase.character}`;

          // when
          const emailError = FieldValidator.validateEmail(email);

          // then
          expect(emailError).toBe('');
        });

        for (let domainDigit = 0; domainDigit <= 9; domainDigit++) {
          for (let number = 1; number <= 3; number++) {
            it(`should not return error if email is wrapped in ${whitespaceTestCase.characterName} and four parts in domain where each part contains ${number} of ${domainDigit} digit`, () => {
              // given
              const part = `${domainDigit}`.repeat(number);
              const email = `${whitespaceTestCase.character}address@[${part}.${part}.${part}.${part}]${whitespaceTestCase.character}`;

              // when
              const emailError = FieldValidator.validateEmail(email);

              // then
              expect(emailError).toBe('');
            });
          }
        }

        [
          {
            character: 'a',
            characterDescription: 'lowercase',
          },
          {
            character: 'A',
            characterDescription: 'capital letter',
          },
          {
            character: 0,
            characterDescription: 'digit',
          },
          {
            character: '-',
            characterDescription: 'dash',
          },
        ].forEach((domainTestScenario) => {
          [
            {
              character: 'A',
              characterDescription: 'capital letter',
            },
            {
              character: 'a',
              characterDescription: 'lowercase',
            },
          ].forEach((topLevelTestScenario) => {
            [
              {
                number: 2,
                numberDescription: 'two',
              },
              {
                number: 3,
                numberDescription: 'more than two',
              },
            ].forEach((numberTestScenario) => {
              it(`should not return error if email is wrapped in ${whitespaceTestCase.characterName}, has one ${domainTestScenario.characterDescription} character in domain name and has ${numberTestScenario.numberDescription} ${topLevelTestScenario.characterDescription} characters in top level domain`, () => {
                // given
                const email = `${whitespaceTestCase.character}address@${
                  domainTestScenario.character
                }.${topLevelTestScenario.character.repeat(
                  numberTestScenario.number
                )}${whitespaceTestCase.character}`;

                // when
                const emailError = FieldValidator.validateEmail(email);

                // then
                expect(emailError).toBe('');
              });

              it(`should not return error if email is wrapped in ${whitespaceTestCase.characterName}, has more than one one ${domainTestScenario.characterDescription} character in domain name and has ${numberTestScenario.numberDescription} ${topLevelTestScenario.characterDescription} characters in top level domain`, () => {
                // given
                const email = `${whitespaceTestCase.character}address@${
                  domainTestScenario.character
                }${
                  domainTestScenario.character
                }.${topLevelTestScenario.character.repeat(
                  numberTestScenario.number
                )}${whitespaceTestCase.character}`;

                // when
                const emailError = FieldValidator.validateEmail(email);

                // then
                expect(emailError).toBe('');
              });

              it(`should not return error if email is wrapped in ${whitespaceTestCase.characterName}, has more than one domain name parts and each of them has one ${domainTestScenario.characterDescription} character and has ${numberTestScenario.numberDescription} ${topLevelTestScenario.characterDescription} characters in top level domain`, () => {
                // given
                const email = `${whitespaceTestCase.character}address@${
                  domainTestScenario.character
                }.${
                  domainTestScenario.character
                }.${topLevelTestScenario.character.repeat(
                  numberTestScenario.number
                )}${whitespaceTestCase.character}`;

                // when
                const emailError = FieldValidator.validateEmail(email);

                // then
                expect(emailError).toBe('');
              });

              it(`should not return error if email is wrapped in ${whitespaceTestCase.characterName}, has more than one domain name parts and each of them has more than one ${domainTestScenario.characterDescription} character and has ${numberTestScenario.numberDescription} ${topLevelTestScenario.characterDescription} characters in top level domain`, () => {
                // given
                const email = `${whitespaceTestCase.character}address@${
                  domainTestScenario.character
                }${domainTestScenario.character}.${
                  domainTestScenario.character
                }${
                  domainTestScenario.character
                }.${topLevelTestScenario.character.repeat(
                  numberTestScenario.number
                )}${whitespaceTestCase.character}`;

                // when
                const emailError = FieldValidator.validateEmail(email);

                // then
                expect(emailError).toBe('');
              });
            });
          });
        });
      });
    });

    describe('Incorrect mail', () => {
      const userNameIncorrectSymbols = [
        {
          character: '<',
          characterDescription: 'opening diamond bracket',
        },
        {
          character: '>',
          characterDescription: 'closing diamond bracket',
        },
        {
          character: '(',
          characterDescription: 'opening round bracket',
        },
        {
          character: ')',
          characterDescription: 'closing round bracket',
        },
        {
          character: '[',
          characterDescription: 'opening square bracket',
        },
        {
          character: ']',
          characterDescription: 'closing square bracket',
        },
        {
          character: '\\',
          characterDescription: 'backslash',
        },
        {
          character: '.',
          characterDescription: 'dot',
        },
        {
          character: ',',
          characterDescription: 'comma',
        },
        {
          character: ';',
          characterDescription: 'semicolon',
        },
        {
          character: ':',
          characterDescription: 'colon',
        },
        {
          character: '@',
          characterDescription: 'at',
        },
      ];
      const incorrectTopLevelDomainCharacters = [
        {
          character: '<',
          characterDescription: 'opening diamond bracket',
        },
        {
          character: '>',
          characterDescription: 'closing diamond bracket',
        },
        {
          character: '(',
          characterDescription: 'opening round bracket',
        },
        {
          character: ')',
          characterDescription: 'closing round bracket',
        },
        {
          character: '[',
          characterDescription: 'opening square bracket',
        },
        {
          character: ']',
          characterDescription: 'closing square bracket',
        },
        {
          character: '\\',
          characterDescription: 'backslash',
        },
        {
          character: '.',
          characterDescription: 'dot',
        },
        {
          character: ',',
          characterDescription: 'comma',
        },
        {
          character: ';',
          characterDescription: 'semicolon',
        },
        {
          character: ':',
          characterDescription: 'colon',
        },
        {
          character: '@',
          characterDescription: 'at',
        },
        {
          character: '-',
          characterDescription: 'minus',
        },
        {
          character: '!',
          characterDescription: 'exclamation mark',
        },
        {
          character: '#',
          characterDescription: 'hash',
        },
        {
          character: '$',
          characterDescription: 'dollar',
        },
        {
          character: '`',
          characterDescription: 'backtick',
        },
        {
          character: '~',
          characterDescription: 'tilde',
        },
        {
          character: '%',
          characterDescription: 'percentage',
        },
        {
          character: '^',
          characterDescription: 'caret',
        },
        {
          character: '&',
          characterDescription: 'ampersand',
        },
        {
          character: '*',
          characterDescription: 'asterisk',
        },
        {
          character: '_',
          characterDescription: 'underscore',
        },
        {
          character: '+',
          characterDescription: 'plus',
        },
        {
          character: '=',
          characterDescription: 'equal',
        },
        {
          character: '{',
          characterDescription: 'opening bracket',
        },
        {
          character: '}',
          characterDescription: 'closing bracket',
        },
        {
          character: '|',
          characterDescription: 'pipe',
        },
        {
          character: "'",
          characterDescription: 'apostrophe',
        },
        {
          character: '/',
          characterDescription: 'slash',
        },
        {
          character: '?',
          characterDescription: 'question mark',
        },
        {
          character: '1',
          characterDescription: 'digit',
        },
      ];
      let error = 'Email has incorrect format';

      beforeEach(() => {
        jest.spyOn(i18next, 't').mockReturnValue(error);
      });

      [
        {
          character: '\t',
          characterName: 'tabulation',
        },
        {
          character: '\n',
          characterName: 'line feed',
        },
        {
          character: '\v',
          characterName: 'line tabulation',
        },
        {
          character: '\f',
          characterName: 'form feed',
        },
        {
          character: '\r',
          characterName: 'carriage return',
        },
        {
          character: ' ',
          characterName: 'space',
        },
        {
          character: '\xa0',
          characterName: 'no break space',
        },
        {
          character: '',
          characterName: 'no white space',
        },
      ].forEach((whitespaceTestCase) => {
        userNameIncorrectSymbols.forEach((userNameSymbolTestCase1) => {
          it(`should return error if email is wrapped in ${whitespaceTestCase.characterName} and has ${userNameSymbolTestCase1.characterDescription} character in only part before @ character`, () => {
            // given
            const email = `${whitespaceTestCase.character}${userNameSymbolTestCase1.character}@email.em${whitespaceTestCase.character}`;

            // when
            const emailError = FieldValidator.validateEmail(email);

            // then
            expect(emailError).toBe(error);
          });

          it(`should return error if email is wrapped in ${whitespaceTestCase.characterName} and has more than one ${userNameSymbolTestCase1.characterDescription} characters in only part before @ character`, () => {
            // given
            const email = `${whitespaceTestCase.character}${userNameSymbolTestCase1.character}${userNameSymbolTestCase1.character}@email.em${whitespaceTestCase.character}`;

            // when
            const emailError = FieldValidator.validateEmail(email);

            // then
            expect(emailError).toBe(error);
          });

          it(`should return error if email is wrapped in ${whitespaceTestCase.characterName} and has correct character in first part and ${userNameSymbolTestCase1.characterDescription} character in second part before @ character`, () => {
            // given
            const email = `${whitespaceTestCase.character}a.${userNameSymbolTestCase1.character}@email.em${whitespaceTestCase.character}`;

            // when
            const emailError = FieldValidator.validateEmail(email);

            // then
            expect(emailError).toBe(error);
          });

          userNameIncorrectSymbols.forEach((userNameSymbolTestCase2) => {
            it(`should return error if email is wrapped in ${whitespaceTestCase.characterName} and has ${userNameSymbolTestCase1.characterDescription} character in first part and ${userNameSymbolTestCase2.characterDescription} character in second part before @ character`, () => {
              // given
              const email = `${whitespaceTestCase.character}${userNameSymbolTestCase1.character}.${userNameSymbolTestCase2.character}@email.em${whitespaceTestCase.character}`;

              // when
              const emailError = FieldValidator.validateEmail(email);

              // then
              expect(emailError).toBe(error);
            });

            it(`should return error if email is wrapped in ${whitespaceTestCase.characterName} and has more than one ${userNameSymbolTestCase1.characterDescription} characters in first part and ${userNameSymbolTestCase2.characterDescription} character in second part before @ character`, () => {
              // given
              const email = `${whitespaceTestCase.character}${userNameSymbolTestCase1.character}${userNameSymbolTestCase1.character}.${userNameSymbolTestCase2.character}@email.em${whitespaceTestCase.character}`;

              // when
              const emailError = FieldValidator.validateEmail(email);

              // then
              expect(emailError).toBe(error);
            });

            it(`should return error if email is wrapped in ${whitespaceTestCase.characterName} and has ${userNameSymbolTestCase1.characterDescription} character in first part and more than one ${userNameSymbolTestCase2.characterDescription} characters in second part before @ character`, () => {
              // given
              const email = `${whitespaceTestCase.character}${userNameSymbolTestCase1.character}.${userNameSymbolTestCase2.character}${userNameSymbolTestCase2.character}@email.em${whitespaceTestCase.character}`;

              // when
              const emailError = FieldValidator.validateEmail(email);

              // then
              expect(emailError).toBe(error);
            });

            it(`should return error if email is wrapped in ${whitespaceTestCase.characterName} and has more than one ${userNameSymbolTestCase1.characterDescription} characters in first part and more than one ${userNameSymbolTestCase2.characterDescription} characters in second part before @ character`, () => {
              // given
              const email = `${whitespaceTestCase.character}${userNameSymbolTestCase1.character}${userNameSymbolTestCase1.character}.${userNameSymbolTestCase2.character}${userNameSymbolTestCase2.character}@email.em${whitespaceTestCase.character}`;

              // when
              const emailError = FieldValidator.validateEmail(email);

              // then
              expect(emailError).toBe(error);
            });
          });
        });

        it(`should return error if email is wrapped in ${whitespaceTestCase.characterName} and has more than two parts with incorrect characters before @ character`, () => {
          // given
          const email = `${whitespaceTestCase.character}[.[.[@email.em${whitespaceTestCase.character}`;

          // when
          const emailError = FieldValidator.validateEmail(email);

          // then
          expect(emailError).toBe(error);
        });

        it(`should return error if email is wrapped in ${whitespaceTestCase.characterName} and has nothing before @ character`, () => {
          // given
          const email = `${whitespaceTestCase.character}@email.em${whitespaceTestCase.character}`;

          // when
          const emailError = FieldValidator.validateEmail(email);

          // then
          expect(emailError).toBe(error);
        });

        it(`should return error if email is wrapped in ${whitespaceTestCase.characterName} and has correct first part but nothing in second part before @ character`, () => {
          // given
          const email = `${whitespaceTestCase.character}a.@email.em${whitespaceTestCase.character}`;

          // when
          const emailError = FieldValidator.validateEmail(email);

          // then
          expect(emailError).toBe(error);
        });

        it(`should return error if email is wrapped in ${whitespaceTestCase.characterName} and has correct second part but nothing in first part before @ character`, () => {
          // given
          const email = `${whitespaceTestCase.character}.a@email.em${whitespaceTestCase.character}`;

          // when
          const emailError = FieldValidator.validateEmail(email);

          // then
          expect(emailError).toBe(error);
        });

        it(`should return error if email is wrapped in ${whitespaceTestCase.characterName} and has quote in first part and no quote in second part before @ character`, () => {
          // given
          const email = `${whitespaceTestCase.character}".a@email.em${whitespaceTestCase.character}`;

          // when
          const emailError = FieldValidator.validateEmail(email);

          // then
          expect(emailError).toBe(error);
        });

        it(`should return error if email is wrapped in ${whitespaceTestCase.characterName} and has no quote in first part and quote in second part before @ character`, () => {
          // given
          const email = `${whitespaceTestCase.character}.a"@email.em${whitespaceTestCase.character}`;

          // when
          const emailError = FieldValidator.validateEmail(email);

          // then
          expect(emailError).toBe(error);
        });

        it(`should return error if email is wrapped in ${whitespaceTestCase.characterName} and has double quotes in first part and no quote in second part before @ character`, () => {
          // given
          const email = `${whitespaceTestCase.character}"".a@email.em${whitespaceTestCase.character}`;

          // when
          const emailError = FieldValidator.validateEmail(email);

          // then
          expect(emailError).toBe(error);
        });

        it(`should return error if email is wrapped in ${whitespaceTestCase.characterName} and has no quote in first part and double quotes in second part before @ character`, () => {
          // given
          const email = `${whitespaceTestCase.character}a.""@email.em${whitespaceTestCase.character}`;

          // when
          const emailError = FieldValidator.validateEmail(email);

          // then
          expect(emailError).toBe(error);
        });

        it(`should return error if email is wrapped in ${whitespaceTestCase.characterName} and has double quotes wrapped nothing before @ character`, () => {
          // given
          const email = `${whitespaceTestCase.character}""@email.em${whitespaceTestCase.character}`;

          // when
          const emailError = FieldValidator.validateEmail(email);

          // then
          expect(emailError).toBe(error);
        });

        it(`should return error if email is wrapped in ${whitespaceTestCase.characterName} and has quote before @ character`, () => {
          // given
          const email = `${whitespaceTestCase.character}"@email.em${whitespaceTestCase.character}`;

          // when
          const emailError = FieldValidator.validateEmail(email);

          // then
          expect(emailError).toBe(error);
        });

        it(`should return error if email is wrapped in ${whitespaceTestCase.characterName} and empty first part and quote in second part before @ character`, () => {
          // given
          const email = `${whitespaceTestCase.character}."@email.em${whitespaceTestCase.character}`;

          // when
          const emailError = FieldValidator.validateEmail(email);

          // then
          expect(emailError).toBe(error);
        });

        it(`should return error if email is wrapped in ${whitespaceTestCase.characterName} and has not @ character`, () => {
          // given
          const email = `${whitespaceTestCase.character}SomeEmail${whitespaceTestCase.character}`;

          // when
          const emailError = FieldValidator.validateEmail(email);

          // then
          expect(emailError).toBe(error);
        });

        [
          {
            number: 0,
            description: 'zero',
          },
          {
            number: 4,
            description: 'more than three',
          },
        ].forEach((numberTestCase) => {
          for (let domainDigit = 0; domainDigit <= 9; domainDigit++) {
            it(`should return error if email is wrapped in ${whitespaceTestCase.characterName} and four parts in domain where each part contains ${numberTestCase.number} of ${domainDigit} digit`, () => {
              // given
              const part = `${domainDigit}`.repeat(numberTestCase.number);
              const email = `${whitespaceTestCase.character}address@[${part}.${part}.${part}.${part}]${whitespaceTestCase.character}`;

              // when
              const emailError = FieldValidator.validateEmail(email);

              // then
              expect(emailError).toBe(error);
            });

            for (let partsNumber = 1; partsNumber <= 3; partsNumber++) {
              it(`should return error if email is wrapped in ${whitespaceTestCase.characterName} and ${partsNumber} parts in domain where each part contains ${numberTestCase.number} of ${domainDigit} digit`, () => {
                // given
                const part = `${domainDigit}`.repeat(numberTestCase.number);
                const notLastParts = `${part}.`.repeat(partsNumber - 1);
                const email = `${whitespaceTestCase.character}address@[${notLastParts}${part}]${whitespaceTestCase.character}`;

                // when
                const emailError = FieldValidator.validateEmail(email);

                // then
                expect(emailError).toBe(error);
              });
            }
          }
        });

        for (let domainDigit = 0; domainDigit <= 9; domainDigit++) {
          for (let number = 1; number <= 3; number++) {
            for (let partsNumber = 1; partsNumber <= 3; partsNumber++) {
              it(`should return error if email is wrapped in ${whitespaceTestCase.characterName} and ${partsNumber} parts in domain where each part contains ${number} of ${domainDigit} digit`, () => {
                // given
                const part = `${domainDigit}`.repeat(number);
                const notLastParts = `${part}.`.repeat(partsNumber - 1);
                const email = `${whitespaceTestCase.character}address@[${notLastParts}${part}]${whitespaceTestCase.character}`;

                // when
                const emailError = FieldValidator.validateEmail(email);

                // then
                expect(emailError).toBe(error);
              });
            }
          }
        }

        [
          {
            character: '<',
            characterDescription: 'opening diamond bracket',
          },
          {
            character: '>',
            characterDescription: 'closing diamond bracket',
          },
          {
            character: '(',
            characterDescription: 'opening round bracket',
          },
          {
            character: ')',
            characterDescription: 'closing round bracket',
          },
          {
            character: '[',
            characterDescription: 'opening square bracket',
          },
          {
            character: ']',
            characterDescription: 'closing square bracket',
          },
          {
            character: '\\',
            characterDescription: 'backslash',
          },
          {
            character: '.',
            characterDescription: 'dot',
          },
          {
            character: ',',
            characterDescription: 'comma',
          },
          {
            character: ';',
            characterDescription: 'semicolon',
          },
          {
            character: ':',
            characterDescription: 'colon',
          },
          {
            character: '@',
            characterDescription: 'at',
          },
          {
            character: '!',
            characterDescription: 'exclamation mark',
          },
          {
            character: '#',
            characterDescription: 'hash',
          },
          {
            character: '$',
            characterDescription: 'dollar',
          },
          {
            character: '`',
            characterDescription: 'backtick',
          },
          {
            character: '~',
            characterDescription: 'tilde',
          },
          {
            character: '%',
            characterDescription: 'percentage',
          },
          {
            character: '^',
            characterDescription: 'caret',
          },
          {
            character: '&',
            characterDescription: 'ampersand',
          },
          {
            character: '*',
            characterDescription: 'asterisk',
          },
          {
            character: '_',
            characterDescription: 'underscore',
          },
          {
            character: '+',
            characterDescription: 'plus',
          },
          {
            character: '=',
            characterDescription: 'equal',
          },
          {
            character: '{',
            characterDescription: 'opening bracket',
          },
          {
            character: '}',
            characterDescription: 'closing bracket',
          },
          {
            character: '|',
            characterDescription: 'pipe',
          },
          {
            character: "'",
            characterDescription: 'apostrophe',
          },
          {
            character: '/',
            characterDescription: 'slash',
          },
          {
            character: '?',
            characterDescription: 'question mark',
          },
        ].forEach((domainTestScenario) => {
          it(`should return error if email is wrapped in ${whitespaceTestCase.characterName}, has one ${domainTestScenario.characterDescription} character in domain name and has correct top level domain`, () => {
            // given
            const email = `${whitespaceTestCase.character}address@${domainTestScenario.character}.aa${whitespaceTestCase.character}`;

            // when
            const emailError = FieldValidator.validateEmail(email);

            // then
            expect(emailError).toBe(error);
          });

          it(`should return error if email is wrapped in ${whitespaceTestCase.characterName}, has one ${domainTestScenario.characterDescription} character in domain name and has not dot after domain part`, () => {
            // given
            const email = `${whitespaceTestCase.character}address@${domainTestScenario.character}aa${whitespaceTestCase.character}`;

            // when
            const emailError = FieldValidator.validateEmail(email);

            // then
            expect(emailError).toBe(error);
          });

          incorrectTopLevelDomainCharacters.forEach(
            (topLevelDomainTestScenario) => {
              it(`should return error if email is wrapped in ${whitespaceTestCase.characterName}, has one ${domainTestScenario.characterDescription} character in domain name and has correct number of ${topLevelDomainTestScenario.characterDescription} characters`, () => {
                // given
                const email = `${whitespaceTestCase.character}address@${domainTestScenario.character}.${topLevelDomainTestScenario.character}${topLevelDomainTestScenario.character}${whitespaceTestCase.character}`;

                // when
                const emailError = FieldValidator.validateEmail(email);

                // then
                expect(emailError).toBe(error);
              });
            }
          );
        });

        it(`should return error if email is wrapped in ${whitespaceTestCase.characterName}, has correct domain name but has not dot at the end of domain name`, () => {
          // given
          const email = `${whitespaceTestCase.character}address@a${whitespaceTestCase.character}`;

          // when
          const emailError = FieldValidator.validateEmail(email);

          // then
          expect(emailError).toBe(error);
        });

        incorrectTopLevelDomainCharacters.forEach(
          (topLevelDomainTestScenario) => {
            it(`should return error if email is wrapped in ${whitespaceTestCase.characterName}, has correct domain name and has correct number of ${topLevelDomainTestScenario.characterDescription} characters`, () => {
              // given
              const email = `${whitespaceTestCase.character}address@a.${topLevelDomainTestScenario.character}${topLevelDomainTestScenario.character}${whitespaceTestCase.character}`;

              // when
              const emailError = FieldValidator.validateEmail(email);

              // then
              expect(emailError).toBe(error);
            });

            it(`should return error if email is wrapped in ${whitespaceTestCase.characterName}, has correct domain name and has one ${topLevelDomainTestScenario.characterDescription} character`, () => {
              // given
              const email = `${whitespaceTestCase.character}address@a.${topLevelDomainTestScenario.character}${whitespaceTestCase.character}`;

              // when
              const emailError = FieldValidator.validateEmail(email);

              // then
              expect(emailError).toBe(error);
            });
          }
        );

        it(`should return error if email is wrapped in ${whitespaceTestCase.characterName}, has nothing in domain name and has correct top level domain`, () => {
          // given
          const email = `${whitespaceTestCase.character}address@.aa${whitespaceTestCase.character}`;

          // when
          const emailError = FieldValidator.validateEmail(email);

          // then
          expect(emailError).toBe(error);
        });

        it(`should return error if email is wrapped in ${whitespaceTestCase.characterName}, has correct domain name and has nothing in top level domain`, () => {
          // given
          const email = `${whitespaceTestCase.character}address@a.${whitespaceTestCase.character}`;

          // when
          const emailError = FieldValidator.validateEmail(email);

          // then
          expect(emailError).toBe(error);
        });

        it(`should return error if email is wrapped in ${whitespaceTestCase.characterName} and has no domain name and top level domain parts`, () => {
          // given
          const email = `${whitespaceTestCase.character}address@${whitespaceTestCase.character}`;

          // when
          const emailError = FieldValidator.validateEmail(email);

          // then
          expect(emailError).toBe(error);
        });

        it(`should return error if email is wrapped in ${whitespaceTestCase.characterName} and has no part before @ character, domain name and top level domain parts`, () => {
          // given
          const email = `${whitespaceTestCase.character}@${whitespaceTestCase.character}`;

          // when
          const emailError = FieldValidator.validateEmail(email);

          // then
          expect(emailError).toBe(error);
        });

        it(`should return error if email contains only ${whitespaceTestCase.characterName} character`, () => {
          // given
          const email = `${whitespaceTestCase.character}`;

          // when
          const emailError = FieldValidator.validateEmail(email);

          // then
          expect(emailError).toBe(error);
        });
      });
    });
  });
});
