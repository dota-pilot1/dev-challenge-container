package com.cj.freshway.fs.cps.common.service.exception;

import com.cj.freshway.fs.common.base.BaseException;

/**
 * @author System
 * @description
 *
 *              <pre>
 * 중계서버 API 호출 관련 예외
 *              </pre>
 */
public class MiddlewareApiException extends BaseException {
  private static final long serialVersionUID = 1L;

  public MiddlewareApiException() {
    super();
  }

  public MiddlewareApiException(String message) {
    super(message);
  }

  public MiddlewareApiException(String code, String message) {
    super(code, message);
  }

  /**
   * @param cause 생성자
   */
  public MiddlewareApiException(Throwable cause) {
    super(cause);
  }
}







