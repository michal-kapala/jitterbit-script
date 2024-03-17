import { describe, expect, test } from '@jest/globals';
import { typecheck } from '../../../utils';

describe('Email functions', function() {
  test('SendEmail()', async function() {
    const script = `<trans>
err = SendEmail(
  from="a@example.com",
  to="b@example.com",
  subject="a very important subject",
  msg="hello, i need my access back. help pls",
  smtpServers="some smtp services here",
  account="user1234",
  password="it should probably not be passed like this",
  cc="c@example.com,d@example.com",
  bcc="b@example.com",
  replyTo="e@example.com",
  ssl=1
);
</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("string");
    expect(result.vars[3].type).toStrictEqual("string");
    expect(result.vars[4].type).toStrictEqual("string");
    expect(result.vars[5].type).toStrictEqual("string");
    expect(result.vars[6].type).toStrictEqual("string");
    expect(result.vars[7].type).toStrictEqual("string");
    expect(result.vars[8].type).toStrictEqual("string");
    expect(result.vars[9].type).toStrictEqual("string");
    expect(result.vars[10].type).toStrictEqual("string");
    expect(result.vars[11].type).toStrictEqual("number");
    expect(result.diagnostics.length).toStrictEqual(1);
    expect(result.diagnostics[0].error).toStrictEqual(false);
  });

  test('SendEmailMessage()', async function() {
    const script = `<trans>err = SendEmailMessage(msgId="some msg id")</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });

  test('SendSystemEmail()', async function() {
    const script = `<trans>
err = SendSystemEmail(
  to="a@example.com,b@example.com",
  subject="Support ticket #k42Fhe4n234gd",
  message="Thank you for your issue submission, one of our support members will contact you in no time."
);
</trans>`;
    const result = typecheck(script);
    expect(result.vars[0].type).toStrictEqual("string");
    expect(result.vars[1].type).toStrictEqual("string");
    expect(result.vars[2].type).toStrictEqual("string");
    expect(result.vars[3].type).toStrictEqual("string");
    expect(result.diagnostics.length).toStrictEqual(0);
  });
});
