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

    userNameCorrectSymbols.forEach((userNameSymbols1) => {
      for (let domainDigit = 0; domainDigit <= 9; domainDigit++) {
        for (let number = 1; number <= 3; number++) {
          it(`should not return error if email has not white space, has ${userNameSymbols1.characterDescription} character in only part before @ character and four parts in domain where each part contains ${number} of ${domainDigit} digit`, () => {
            // given
            const part = `${domainDigit}`.repeat(number);
            const email = `${userNameSymbols1.character}@[${part}.${part}.${part}.${part}]`;

            // when
            const emailError = FieldValidator.validateEmail(email);

            // then
            expect(emailError).toBe('');
          });

          it(`should not return error if email has not white space, has more than one ${userNameSymbols1.characterDescription} characters in only part before @ character and four parts in domain where each part contains ${number} of ${domainDigit} digit`, () => {
            // given
            const part = `${domainDigit}`.repeat(number);
            const email = `${userNameSymbols1.character}${userNameSymbols1.character}@[${part}.${part}.${part}.${part}]`;

            // when
            const emailError = FieldValidator.validateEmail(email);

            // then
            expect(emailError).toBe('');
          });

          userNameCorrectSymbols.forEach((userNameSymbols2) => {
            it(`should not return error if email has not white space, has ${userNameSymbols1.characterDescription} character in first part, ${userNameSymbols2.characterDescription} character in second part before @ character and four parts in domain where each part contains ${number} of ${domainDigit} digit`, () => {
              // given
              const part = `${domainDigit}`.repeat(number);
              const email = `${userNameSymbols1.character}.${userNameSymbols2.character}@[${part}.${part}.${part}.${part}]`;

              // when
              const emailError = FieldValidator.validateEmail(email);

              // then
              expect(emailError).toBe('');
            });

            it(`should not return error if email has not white space, has more than one ${userNameSymbols1.characterDescription} characters in first part, ${userNameSymbols2.characterDescription} character in second part before @ character and four parts in domain where each part contains ${number} of ${domainDigit} digit`, () => {
              // given
              const part = `${domainDigit}`.repeat(number);
              const email = `${userNameSymbols1.character}${userNameSymbols1.character}.${userNameSymbols2.character}@[${part}.${part}.${part}.${part}]`;

              // when
              const emailError = FieldValidator.validateEmail(email);

              // then
              expect(emailError).toBe('');
            });

            it(`should not return error if email has not white space, has ${userNameSymbols1.characterDescription} character in first part, more than one ${userNameSymbols2.characterDescription} characters in second part before @ character and four parts in domain where each part contains ${number} of ${domainDigit} digit`, () => {
              // given
              const part = `${domainDigit}`.repeat(number);
              const email = `${userNameSymbols1.character}.${userNameSymbols2.character}${userNameSymbols2.character}@[${part}.${part}.${part}.${part}]`;

              // when
              const emailError = FieldValidator.validateEmail(email);

              // then
              expect(emailError).toBe('');
            });

            it(`should not return error if email has not white space, has more than one ${userNameSymbols1.characterDescription} characters in first part, more than one ${userNameSymbols2.characterDescription} characters in second part before @ character and four parts in domain where each part contains ${number} of ${domainDigit} digit`, () => {
              // given
              const part = `${domainDigit}`.repeat(number);
              const email = `${userNameSymbols1.character}${userNameSymbols1.character}.${userNameSymbols2.character}${userNameSymbols2.character}@[${part}.${part}.${part}.${part}]`;

              // when
              const emailError = FieldValidator.validateEmail(email);

              // then
              expect(emailError).toBe('');
            });
          });
        }
      }
    });

    for (let domainDigit = 0; domainDigit <= 9; domainDigit++) {
      for (let number = 1; number <= 3; number++) {
        it(`should not return error if email has not white space, has more than two parts with correct characters before @ character and four parts in domain where each part contains ${number} of ${domainDigit} digit`, () => {
          // given
          const part = `${domainDigit}`.repeat(number);
          const email = `a.b.c@[${part}.${part}.${part}.${part}]`;

          // when
          const emailError = FieldValidator.validateEmail(email);

          // then
          expect(emailError).toBe('');
        });

        it(`should not return error if email has not white space, has character wrapped in quote before @ character and four parts in domain where each part contains ${number} of ${domainDigit} digit`, () => {
          // given
          const part = `${domainDigit}`.repeat(number);
          const email = `"a"@[${part}.${part}.${part}.${part}]`;

          // when
          const emailError = FieldValidator.validateEmail(email);

          // then
          expect(emailError).toBe('');
        });

        it(`should not return error if email has not white space,  has more than one character wrapped in quote before @ character and four parts in domain where each part contains ${number} of ${domainDigit} digit`, () => {
          // given
          const part = `${domainDigit}`.repeat(number);
          const email = `"ab"@[${part}.${part}.${part}.${part}]`;

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
          it(`should not return error if email has not white space, has more than two parts with correct characters before @ character, has one ${domainTestScenario.characterDescription} character in domain name and has ${numberTestScenario.numberDescription} ${topLevelTestScenario.characterDescription} characters in top level domain`, () => {
            // given
            const email = `a.b.c@${
              domainTestScenario.character
            }.${topLevelTestScenario.character.repeat(
              numberTestScenario.number
            )}`;

            // when
            const emailError = FieldValidator.validateEmail(email);

            // then
            expect(emailError).toBe('');
          });

          it(`should not return error if email has not white space, has character wrapped in quote before @ character, has one ${domainTestScenario.characterDescription} character in domain name and has ${numberTestScenario.numberDescription} ${topLevelTestScenario.characterDescription} characters in top level domain`, () => {
            // given
            const email = `"a"@${
              domainTestScenario.character
            }.${topLevelTestScenario.character.repeat(
              numberTestScenario.number
            )}`;

            // when
            const emailError = FieldValidator.validateEmail(email);

            // then
            expect(emailError).toBe('');
          });

          it(`should not return error if email has not white space, has more than one character wrapped in quote before @ character, has one ${domainTestScenario.characterDescription} character in domain name and has ${numberTestScenario.numberDescription} ${topLevelTestScenario.characterDescription} characters in top level domain`, () => {
            // given
            const email = `"ab"@${
              domainTestScenario.character
            }.${topLevelTestScenario.character.repeat(
              numberTestScenario.number
            )}`;

            // when
            const emailError = FieldValidator.validateEmail(email);

            // then
            expect(emailError).toBe('');
          });

          it(`should not return error if email has not white space, has more than two parts with correct characters before @ character, has more than one domain name parts and each of them has one ${domainTestScenario.characterDescription} character and has ${numberTestScenario.numberDescription} ${topLevelTestScenario.characterDescription} characters in top level domain`, () => {
            // given
            const email = `a.b.c@${domainTestScenario.character}.${
              domainTestScenario.character
            }.${topLevelTestScenario.character.repeat(
              numberTestScenario.number
            )}`;

            // when
            const emailError = FieldValidator.validateEmail(email);

            // then
            expect(emailError).toBe('');
          });

          it(`should not return error if email has not white space, has character wrapped in quote before @ character, has more than one domain name parts and each of them has one ${domainTestScenario.characterDescription} character and has ${numberTestScenario.numberDescription} ${topLevelTestScenario.characterDescription} characters in top level domain`, () => {
            // given
            const email = `"a"@${domainTestScenario.character}.${
              domainTestScenario.character
            }.${topLevelTestScenario.character.repeat(
              numberTestScenario.number
            )}`;

            // when
            const emailError = FieldValidator.validateEmail(email);

            // then
            expect(emailError).toBe('');
          });

          it(`should not return error if email has not white space, has more than one character wrapped in quote before @ character, has more than one domain name parts and each of them has one ${domainTestScenario.characterDescription} character and has ${numberTestScenario.numberDescription} ${topLevelTestScenario.characterDescription} characters in top level domain`, () => {
            // given
            const email = `"ab"@${domainTestScenario.character}.${
              domainTestScenario.character
            }.${topLevelTestScenario.character.repeat(
              numberTestScenario.number
            )}`;

            // when
            const emailError = FieldValidator.validateEmail(email);

            // then
            expect(emailError).toBe('');
          });

          it(`should not return error if email has not white space, has more than two parts with correct characters before @ character, has more than one domain name parts and each of them has more than one ${domainTestScenario.characterDescription} character and has ${numberTestScenario.numberDescription} ${topLevelTestScenario.characterDescription} characters in top level domain`, () => {
            // given
            const email = `a.b.c@${domainTestScenario.character}${
              domainTestScenario.character
            }.${domainTestScenario.character}${
              domainTestScenario.character
            }.${topLevelTestScenario.character.repeat(
              numberTestScenario.number
            )}`;

            // when
            const emailError = FieldValidator.validateEmail(email);

            // then
            expect(emailError).toBe('');
          });

          it(`should not return error if email has not white space, has character wrapped in quote before @ character, has more than one domain name parts and each of them has more than one ${domainTestScenario.characterDescription} character and has ${numberTestScenario.numberDescription} ${topLevelTestScenario.characterDescription} characters in top level domain`, () => {
            // given
            const email = `"a"@${domainTestScenario.character}${
              domainTestScenario.character
            }.${domainTestScenario.character}${
              domainTestScenario.character
            }.${topLevelTestScenario.character.repeat(
              numberTestScenario.number
            )}`;

            // when
            const emailError = FieldValidator.validateEmail(email);

            // then
            expect(emailError).toBe('');
          });

          it(`should not return error if email has not white space, has more than one domain name parts and each of them has more than one ${domainTestScenario.characterDescription} character and has ${numberTestScenario.numberDescription} ${topLevelTestScenario.characterDescription} characters in top level domain`, () => {
            // given
            const email = `"ab"@${domainTestScenario.character}${
              domainTestScenario.character
            }.${domainTestScenario.character}${
              domainTestScenario.character
            }.${topLevelTestScenario.character.repeat(
              numberTestScenario.number
            )}`;

            // when
            const emailError = FieldValidator.validateEmail(email);

            // then
            expect(emailError).toBe('');
          });

          userNameCorrectSymbols.forEach((userNameSymbols1) => {
            it(`should not return error if email has not white space, has ${userNameSymbols1.characterDescription} character in only part before @ character, has one ${domainTestScenario.characterDescription} character in domain name and has ${numberTestScenario.numberDescription} ${topLevelTestScenario.characterDescription} characters in top level domain`, () => {
              // given
              const email = `${userNameSymbols1.character}@${
                domainTestScenario.character
              }.${topLevelTestScenario.character.repeat(
                numberTestScenario.number
              )}`;

              // when
              const emailError = FieldValidator.validateEmail(email);

              // then
              expect(emailError).toBe('');
            });

            it(`should not return error if email has not white space, has more than one ${userNameSymbols1.characterDescription} characters in only part before @ character, has one ${domainTestScenario.characterDescription} character in domain name and has ${numberTestScenario.numberDescription} ${topLevelTestScenario.characterDescription} characters in top level domain`, () => {
              // given
              const email = `${userNameSymbols1.character}${
                userNameSymbols1.character
              }@${
                domainTestScenario.character
              }.${topLevelTestScenario.character.repeat(
                numberTestScenario.number
              )}`;

              // when
              const emailError = FieldValidator.validateEmail(email);

              // then
              expect(emailError).toBe('');
            });

            it(`should not return error if email has not white space, has ${userNameSymbols1.characterDescription} character in only part before @ character, has more than one domain name parts and each of them has one ${domainTestScenario.characterDescription} character and has ${numberTestScenario.numberDescription} ${topLevelTestScenario.characterDescription} characters in top level domain`, () => {
              // given
              const email = `${userNameSymbols1.character}@${
                domainTestScenario.character
              }.${
                domainTestScenario.character
              }.${topLevelTestScenario.character.repeat(
                numberTestScenario.number
              )}`;

              // when
              const emailError = FieldValidator.validateEmail(email);

              // then
              expect(emailError).toBe('');
            });

            it(`should not return error if email has not white space, has more than one ${userNameSymbols1.characterDescription} characters in only part before @ character, has more than one domain name parts and each of them has one ${domainTestScenario.characterDescription} character and has ${numberTestScenario.numberDescription} ${topLevelTestScenario.characterDescription} characters in top level domain`, () => {
              // given
              const email = `${userNameSymbols1.character}${
                userNameSymbols1.character
              }@${domainTestScenario.character}.${
                domainTestScenario.character
              }.${topLevelTestScenario.character.repeat(
                numberTestScenario.number
              )}`;

              // when
              const emailError = FieldValidator.validateEmail(email);

              // then
              expect(emailError).toBe('');
            });

            it(`should not return error if email has not white space, has ${userNameSymbols1.characterDescription} character in only part before @ character, has more than one domain name parts and each of them has more than one ${domainTestScenario.characterDescription} character and has ${numberTestScenario.numberDescription} ${topLevelTestScenario.characterDescription} characters in top level domain`, () => {
              // given
              const email = `${userNameSymbols1.character}@${
                domainTestScenario.character
              }${domainTestScenario.character}.${domainTestScenario.character}${
                domainTestScenario.character
              }.${topLevelTestScenario.character.repeat(
                numberTestScenario.number
              )}`;

              // when
              const emailError = FieldValidator.validateEmail(email);

              // then
              expect(emailError).toBe('');
            });

            it(`should not return error if email has not white space, has more than one ${userNameSymbols1.characterDescription} characters in only part before @ character, has more than one domain name parts and each of them has more than one ${domainTestScenario.characterDescription} character and has ${numberTestScenario.numberDescription} ${topLevelTestScenario.characterDescription} characters in top level domain`, () => {
              // given
              const email = `${userNameSymbols1.character}${
                userNameSymbols1.character
              }@${domainTestScenario.character}${
                domainTestScenario.character
              }.${domainTestScenario.character}${
                domainTestScenario.character
              }.${topLevelTestScenario.character.repeat(
                numberTestScenario.number
              )}`;

              // when
              const emailError = FieldValidator.validateEmail(email);

              // then
              expect(emailError).toBe('');
            });

            userNameCorrectSymbols.forEach((userNameSymbols2) => {
              it(`should not return error if email has not white space, has ${userNameSymbols1.characterDescription} character in first part, ${userNameSymbols2.characterDescription} character in second part before @ character, has one ${domainTestScenario.characterDescription} character in domain name and has ${numberTestScenario.numberDescription} ${topLevelTestScenario.characterDescription} characters in top level domain`, () => {
                // given
                const email = `${userNameSymbols1.character}.${
                  userNameSymbols2.character
                }@${
                  domainTestScenario.character
                }.${topLevelTestScenario.character.repeat(
                  numberTestScenario.number
                )}`;

                // when
                const emailError = FieldValidator.validateEmail(email);

                // then
                expect(emailError).toBe('');
              });

              it(`should not return error if email has not white space, has more than one ${userNameSymbols1.characterDescription} characters in first part, ${userNameSymbols2.characterDescription} character in second part before @ character, has one ${domainTestScenario.characterDescription} character in domain name and has ${numberTestScenario.numberDescription} ${topLevelTestScenario.characterDescription} characters in top level domain`, () => {
                // given
                const email = `${userNameSymbols1.character}${
                  userNameSymbols1.character
                }.${userNameSymbols2.character}@${
                  domainTestScenario.character
                }.${topLevelTestScenario.character.repeat(
                  numberTestScenario.number
                )}`;

                // when
                const emailError = FieldValidator.validateEmail(email);

                // then
                expect(emailError).toBe('');
              });

              it(`should not return error if email has not white space, has ${userNameSymbols1.characterDescription} character in first part, more than one ${userNameSymbols2.characterDescription} characters in second part before @ character, has one ${domainTestScenario.characterDescription} character in domain name and has ${numberTestScenario.numberDescription} ${topLevelTestScenario.characterDescription} characters in top level domain`, () => {
                // given
                const email = `${userNameSymbols1.character}.${
                  userNameSymbols2.character
                }${userNameSymbols2.character}@${
                  domainTestScenario.character
                }.${topLevelTestScenario.character.repeat(
                  numberTestScenario.number
                )}`;

                // when
                const emailError = FieldValidator.validateEmail(email);

                // then
                expect(emailError).toBe('');
              });

              it(`should not return error if email has not white space, has more than one ${userNameSymbols1.characterDescription} characters in first part, more than one ${userNameSymbols2.characterDescription} characters in second part before @ character, has one ${domainTestScenario.characterDescription} character in domain name and has ${numberTestScenario.numberDescription} ${topLevelTestScenario.characterDescription} characters in top level domain`, () => {
                // given
                const email = `${userNameSymbols1.character}${
                  userNameSymbols1.character
                }.${userNameSymbols2.character}${userNameSymbols2.character}@${
                  domainTestScenario.character
                }.${topLevelTestScenario.character.repeat(
                  numberTestScenario.number
                )}`;

                // when
                const emailError = FieldValidator.validateEmail(email);

                // then
                expect(emailError).toBe('');
              });

              it(`should not return error if email has not white space, has ${userNameSymbols1.characterDescription} character in first part, ${userNameSymbols2.characterDescription} character in second part before @ character, has more than one domain name parts and each of them has one ${domainTestScenario.characterDescription} character and has ${numberTestScenario.numberDescription} ${topLevelTestScenario.characterDescription} characters in top level domain`, () => {
                // given
                const email = `${userNameSymbols1.character}.${
                  userNameSymbols2.character
                }@${domainTestScenario.character}.${
                  domainTestScenario.character
                }.${topLevelTestScenario.character.repeat(
                  numberTestScenario.number
                )}`;

                // when
                const emailError = FieldValidator.validateEmail(email);

                // then
                expect(emailError).toBe('');
              });

              it(`should not return error if email has not white space, has more than one ${userNameSymbols1.characterDescription} characters in first part, ${userNameSymbols2.characterDescription} character in second part before @ character, has more than one domain name parts and each of them has one ${domainTestScenario.characterDescription} character and has ${numberTestScenario.numberDescription} ${topLevelTestScenario.characterDescription} characters in top level domain`, () => {
                // given
                const email = `${userNameSymbols1.character}${
                  userNameSymbols1.character
                }.${userNameSymbols2.character}@${
                  domainTestScenario.character
                }.${
                  domainTestScenario.character
                }.${topLevelTestScenario.character.repeat(
                  numberTestScenario.number
                )}`;

                // when
                const emailError = FieldValidator.validateEmail(email);

                // then
                expect(emailError).toBe('');
              });

              it(`should not return error if email has not white space, has ${userNameSymbols1.characterDescription} character in first part, more than one ${userNameSymbols2.characterDescription} characters in second part before @ character, has more than one domain name parts and each of them has one ${domainTestScenario.characterDescription} character and has ${numberTestScenario.numberDescription} ${topLevelTestScenario.characterDescription} characters in top level domain`, () => {
                // given
                const email = `${userNameSymbols1.character}.${
                  userNameSymbols2.character
                }${userNameSymbols2.character}@${
                  domainTestScenario.character
                }.${
                  domainTestScenario.character
                }.${topLevelTestScenario.character.repeat(
                  numberTestScenario.number
                )}`;

                // when
                const emailError = FieldValidator.validateEmail(email);

                // then
                expect(emailError).toBe('');
              });

              it(`should not return error if email has not white space, has more than one ${userNameSymbols1.characterDescription} characters in first part, more than one ${userNameSymbols2.characterDescription} characters in second part before @ character, has more than one domain name parts and each of them has one ${domainTestScenario.characterDescription} character and has ${numberTestScenario.numberDescription} ${topLevelTestScenario.characterDescription} characters in top level domain`, () => {
                // given
                const email = `${userNameSymbols1.character}${
                  userNameSymbols1.character
                }.${userNameSymbols2.character}${userNameSymbols2.character}@${
                  domainTestScenario.character
                }.${
                  domainTestScenario.character
                }.${topLevelTestScenario.character.repeat(
                  numberTestScenario.number
                )}`;

                // when
                const emailError = FieldValidator.validateEmail(email);

                // then
                expect(emailError).toBe('');
              });

              it(`should not return error if email has not white space, has ${userNameSymbols1.characterDescription} character in first part, ${userNameSymbols2.characterDescription} character in second part before @ character, has more than one domain name parts and each of them has more than one ${domainTestScenario.characterDescription} character and has ${numberTestScenario.numberDescription} ${topLevelTestScenario.characterDescription} characters in top level domain`, () => {
                // given
                const email = `${userNameSymbols1.character}.${
                  userNameSymbols2.character
                }@${domainTestScenario.character}${
                  domainTestScenario.character
                }.${domainTestScenario.character}${
                  domainTestScenario.character
                }.${topLevelTestScenario.character.repeat(
                  numberTestScenario.number
                )}`;

                // when
                const emailError = FieldValidator.validateEmail(email);

                // then
                expect(emailError).toBe('');
              });

              it(`should not return error if email has not white space, has more than one ${userNameSymbols1.characterDescription} characters in first part, ${userNameSymbols2.characterDescription} character in second part before @ character, has more than one domain name parts and each of them has more than one ${domainTestScenario.characterDescription} character and has ${numberTestScenario.numberDescription} ${topLevelTestScenario.characterDescription} characters in top level domain`, () => {
                // given
                const email = `${userNameSymbols1.character}${
                  userNameSymbols1.character
                }.${userNameSymbols2.character}@${
                  domainTestScenario.character
                }${domainTestScenario.character}.${
                  domainTestScenario.character
                }${
                  domainTestScenario.character
                }.${topLevelTestScenario.character.repeat(
                  numberTestScenario.number
                )}`;

                // when
                const emailError = FieldValidator.validateEmail(email);

                // then
                expect(emailError).toBe('');
              });

              it(`should not return error if email has not white space, has ${userNameSymbols1.characterDescription} character in first part, more than one ${userNameSymbols2.characterDescription} characters in second part before @ character, has more than one domain name parts and each of them has more than one ${domainTestScenario.characterDescription} character and has ${numberTestScenario.numberDescription} ${topLevelTestScenario.characterDescription} characters in top level domain`, () => {
                // given
                const email = `${userNameSymbols1.character}.${
                  userNameSymbols2.character
                }${userNameSymbols2.character}@${domainTestScenario.character}${
                  domainTestScenario.character
                }.${domainTestScenario.character}${
                  domainTestScenario.character
                }.${topLevelTestScenario.character.repeat(
                  numberTestScenario.number
                )}`;

                // when
                const emailError = FieldValidator.validateEmail(email);

                // then
                expect(emailError).toBe('');
              });

              it(`should not return error if email has not white space, has more than one ${userNameSymbols1.characterDescription} characters in first part, more than one ${userNameSymbols2.characterDescription} characters in second part before @ character, has more than one domain name parts and each of them has more than one ${domainTestScenario.characterDescription} character and has ${numberTestScenario.numberDescription} ${topLevelTestScenario.characterDescription} characters in top level domain`, () => {
                // given
                const email = `${userNameSymbols1.character}${
                  userNameSymbols1.character
                }.${userNameSymbols2.character}${userNameSymbols2.character}@${
                  domainTestScenario.character
                }${domainTestScenario.character}.${
                  domainTestScenario.character
                }${
                  domainTestScenario.character
                }.${topLevelTestScenario.character.repeat(
                  numberTestScenario.number
                )}`;

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
  });
});
