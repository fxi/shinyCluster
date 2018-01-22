library(shiny)

ui = fluidPage(
  plotOutput("i"),
  actionButton("w","warning"),
  actionButton("e","error"),
  actionButton("m","message"),
  sliderInput("s","range",min=0,max=1000,value=100)
  )

server <- function(input,output){

  observeEvent(input$m,{
    message("message")
  })

  observeEvent(input$w,{
    warning("warning")
  })

  observeEvent(input$e,{
    stop("error")
  })

  output$i <- renderPlot({
    plot(rnorm(1:input$s))
  })
}

shinyApp(
  ui = ui,
  server =server
  )
